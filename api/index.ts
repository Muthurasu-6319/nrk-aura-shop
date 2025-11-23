import express from 'express';
import cors from 'cors';
import db from './db.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Vercel handles CORS automatically if configured in vercel.json,
// but we keep this for local dev and explicit permission.
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Allow frontend domain or ALL for debugging
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Helper function to convert undefined to null for MySQL
const v = (val) => (val === undefined ? null : val);

// ------------------------------------------
// 0. CONFIGURATIONS (RAZORPAY & NODEMAILER)
// ------------------------------------------

// Razorpay Config
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Nodemailer Config (Email Sender)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Check .env file
        pass: process.env.EMAIL_PASS // Check .env file (App Password)
    }
});

// Helper: Send Email Function
const sendEmail = async (to, subject, htmlContent) => {
    try {
        const info = await transporter.sendMail({
            from: `"NRK Aura" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent
        });
        console.log(`📧 Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    } catch (error) {
        console.error("❌ Email sending failed:", error);
    }
};

// ==========================================
// A. VERCEL DEBUGGING ROUTES (NEW)
// ==========================================

// 1. Simple Server Check
app.get('/api/hello', (req, res) => {
    res.json({ message: "Backend is working! 🎉", time: new Date().toISOString() });
});

// 2. Database Connection Check
app.get('/api/db-check', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT 1 as val');
        res.json({ status: "Database Connected 🟢", result: rows });
    } catch (err) {
        console.error("DB Check Failed:", err);
        res.status(500).json({ status: "Database Failed 🔴", error: err.message });
    }
});

// ==========================================
// 1. PAYMENT & ORDER ENDPOINTS
// ==========================================

// Create Razorpay Order
app.post('/api/create-payment-order', async (req, res) => {
    const { amount, currency = 'INR' } = req.body;
    try {
        const options = {
            amount: amount * 100, // Convert to Paise
            currency,
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ error: 'Payment initiation failed' });
    }
});

// Verify Payment Signature
app.post('/api/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        res.json({ success: true, message: "Payment Verified" });
    } else {
        res.status(400).json({ success: false, error: "Invalid Signature" });
    }
});

// PLACE ORDER
app.post('/api/orders', async (req, res) => {
    const order = req.body;
    const { id, userId, date, total, paymentMethod, shippingDetails, items } = order;

    console.log("📦 Placing Order:", id);
    try {
        // 1. Insert into Orders Table
        await db.execute(
            `INSERT INTO orders (
            id, user_id, order_date, status, total_amount, payment_method, 
            shipping_name, shipping_email, shipping_address, shipping_city, 
            shipping_zip, shipping_state, shipping_phone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, userId, date, 'Pending', total, paymentMethod,
                `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                shippingDetails.email, shippingDetails.address, shippingDetails.city,
                shippingDetails.zip, shippingDetails.state, shippingDetails.phone
            ]
        );

        // 2. Insert into Order Items Table
        for (const item of items) {
            await db.execute(
                `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, image_url) 
             VALUES (?, ?, ?, ?, ?, ?)`,
                [id, item.id, item.name, item.quantity, item.price, item.image]
            );
        }

        // 3. Send Email to Admin
        const adminHtml = `
        <h2>New Order Received! 🎉</h2>
        <p><strong>Order ID:</strong> ${id}</p>
        <p><strong>Customer:</strong> ${shippingDetails.firstName} ${shippingDetails.lastName}</p>
        <p><strong>Total:</strong> ₹${total}</p>
        <p><strong>Payment:</strong> ${paymentMethod}</p>
        <hr/>
        <h3>Items:</h3>
        <ul>
            ${items.map(i => `<li>${i.name} (x${i.quantity})</li>`).join('')}
        </ul>
        <p>Please check the Admin Dashboard to process this order.</p>
    `;

        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
        await sendEmail(adminEmail, `New Order Alert #${id}`, adminHtml);

        res.json({ success: true });

    } catch (err) {
        console.error("❌ Place Order Error:", err);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// GET ALL ORDERS
app.get('/api/orders', async (req, res) => {
    try {
        const [orders] = await db.execute('SELECT * FROM orders ORDER BY order_date DESC');

        const fullOrders = await Promise.all(orders.map(async (o) => {
            const [items] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
            return {
                id: o.id,
                userId: o.user_id,
                date: o.order_date,
                status: o.status,
                total: parseFloat(o.total_amount),
                paymentMethod: o.payment_method,
                shippingDetails: {
                    firstName: o.shipping_name.split(' ')[0],
                    lastName: o.shipping_name.split(' ')[1] || '',
                    email: o.shipping_email,
                    phone: o.shipping_phone,
                    address: o.shipping_address,
                    city: o.shipping_city,
                    state: o.shipping_state,
                    zip: o.shipping_zip
                },
                items: items.map(i => ({
                    id: i.product_id,
                    name: i.product_name,
                    quantity: i.quantity,
                    price: parseFloat(i.price),
                    image: i.image_url
                }))
            };
        }));

        res.json(fullOrders);
    } catch (err) {
        console.error("Fetch Orders Error:", err);
        res.status(500).json({ error: 'DB Error' });
    }
});

// UPDATE ORDER STATUS
app.put('/api/orders/:id/status', async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

        const [orderRows] = await db.execute('SELECT shipping_email, shipping_name FROM orders WHERE id = ?', [id]);

        if (orderRows.length > 0) {
            const { shipping_email, shipping_name } = orderRows[0];
            const userHtml = `
            <h2>Order Status Update 🚚</h2>
            <p>Hello ${shipping_name},</p>
            <p>Your order <strong>#${id}</strong> status has been updated to: <span style="color:#065F46; font-weight:bold;">${status}</span>.</p>
            <p>Thank you for shopping with NRK Aura.</p>
        `;
            await sendEmail(shipping_email, `Order Update: #${id} is ${status}`, userHtml);
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Update Status Error:", err);
        res.status(500).json({ error: 'Update Failed' });
    }
});

// DELETE ORDER
app.delete('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    console.log("🗑 Deleting Order:", id);
    try {
        // 1. Delete items first (Manually handling Foreign Key)
        await db.execute('DELETE FROM order_items WHERE order_id = ?', [id]);

        // 2. Delete the order
        const [result] = await db.execute('DELETE FROM orders WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            console.log("✅ Order Deleted Successfully");
            res.json({ success: true });
        } else {
            console.log("⚠️ Order ID not found in DB");
            res.status(404).json({ error: "Order not found" });
        }
    } catch (err) {
        console.error("❌ Delete Order Error:", err);
        res.status(500).json({ error: 'Delete Failed: ' + err.message });
    }
});

// Contact Form
app.post('/api/contact-form', async (req, res) => {
    const { name, email, subject, message } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const emailHtml = `
    <h2>New Contact Form Message Received 📧</h2>
    <p>You have received a new message from the contact form.</p>
    <hr/>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <h3>Message:</h3>
    <p style="border: 1px solid #ccc; padding: 15px; background-color: #f9f9f9; white-space: pre-wrap;">${message}</p>
`;

    try {
        await sendEmail(adminEmail, `[Contact Form] ${subject} from ${name}`, emailHtml);

        const userConfirmationHtml = `
        <h2>Thank You for Contacting NRK Aura!</h2>
        <p>Dear ${name},</p>
        <p>We have successfully received your message regarding: <strong>${subject}</strong>.</p>
        <p>Our concierge will review your inquiry and aim to respond within 24 hours.</p>
    `;

        await sendEmail(email, `Confirmation: Your Message to NRK Aura`, userConfirmationHtml);

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error("❌ Contact Form Email Error:", error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// ==========================================
// 2. PRODUCTS ENDPOINTS
// ==========================================

// GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
        const formatted = rows.map((p) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            category: p.category,
            description: p.description,
            image: p.image_url,
            shippingCost: parseFloat(p.shipping_cost || 0),
            isVisible: p.is_visible === 1,
            tags: [],
        }));
        res.json(formatted);
    } catch (err) {
        console.error('Fetch Products Error:', err);
        res.status(500).json({ error: 'DB Error' });
    }
});

// ADD PRODUCT
app.post('/api/products', async (req, res) => {
    const { id, name, price, category, description, image, shippingCost, isVisible } = req.body;
    try {
        await db.execute(
            'INSERT INTO products (id, name, price, category, description, image_url, shipping_cost, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, price, category, description, image, shippingCost || 0, isVisible ? 1 : 0]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Add Product Error:', err.message);
        res.status(500).json({ error: 'Insert Failed: ' + err.message });
    }
});

// UPDATE PRODUCT
app.put('/api/products/:id', async (req, res) => {
    const { name, price, category, description, image, shippingCost, isVisible } = req.body;
    const { id } = req.params;
    try {
        await db.execute(
            'UPDATE products SET name=?, price=?, category=?, description=?, image_url=?, shipping_cost=?, is_visible=? WHERE id=?',
            [name, price, category, description, image, shippingCost || 0, isVisible ? 1 : 0, id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Update Product Error:', err);
        res.status(500).json({ error: 'Update Failed' });
    }
});

// DELETE PRODUCT
app.delete('/api/products/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM products WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete Product Error:', err);
        res.status(500).json({ error: 'Delete Failed' });
    }
});

// ==========================================
// 3. REVIEWS ENDPOINTS
// ==========================================

// GET ALL REVIEWS
app.get('/api/reviews', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM reviews ORDER BY date DESC');
        const formatted = rows.map(r => ({
            id: r.id,
            productId: r.product_id,
            userId: r.user_id,
            userName: r.user_name,
            rating: r.rating,
            comment: r.comment,
            date: r.date
        }));
        res.json(formatted);
    } catch (err) {
        console.error("Fetch Reviews Error:", err);
        res.status(500).json({ error: 'DB Error' });
    }
});

// ADD REVIEW
app.post('/api/reviews', async (req, res) => {
    const { id, productId, userId, userName, rating, comment, date } = req.body;
    try {
        await db.execute(
            'INSERT INTO reviews (id, product_id, user_id, user_name, rating, comment, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, productId, userId, userName, rating, comment, date]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("Add Review Error:", err);
        res.status(500).json({ error: 'Insert Failed' });
    }
});

// DELETE REVIEW
app.delete('/api/reviews/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM reviews WHERE id = ?', [req.params.id]);
        if (result.affectedRows > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: "Review not found" });
        }
    } catch (err) {
        console.error("Delete Review Error:", err);
        res.status(500).json({ error: 'Delete Failed' });
    }
});

// ==========================================
// 4. WISHLIST ENDPOINTS
// ==========================================

app.get('/api/wishlist/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `SELECT p.id, p.name, p.price, p.category, p.description, p.image_url, p.shipping_cost, p.is_visible FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?`;
        const [rows] = await db.execute(query, [userId]);

        const formatted = rows.map((p) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            category: p.category,
            description: p.description,
            image: p.image_url,
            shippingCost: parseFloat(p.shipping_cost || 0),
            isVisible: p.is_visible === 1,
            tags: [],
        }));

        res.json(formatted);
    } catch (err) {
        console.error("Fetch Wishlist Error:", err);
        res.status(500).json({ error: 'DB Error' });
    }
});

app.post('/api/wishlist', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const [productCheck] = await db.execute('SELECT id FROM products WHERE id = ?', [productId]);
        if (productCheck.length === 0) {
            return res.status(404).json({ error: 'Product not found in DB.' });
        }
        await db.execute(
            'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("Add Wishlist Error:", err.message);
        res.status(500).json({ error: 'Insert Failed' });
    }
});

app.delete('/api/wishlist/:userId/:productId', async (req, res) => {
    const { userId, productId } = req.params;
    try {
        await db.execute(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("Remove Wishlist Error:", err);
        res.status(500).json({ error: 'Delete Failed' });
    }
});

// ==========================================
// 5. AUTH & USER MANAGEMENT
// ==========================================

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    const id = Date.now().toString();
    try {
        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        await db.execute(
            'INSERT INTO users (id, name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [id, name, email, password, 'user', 'active']
        );

        res.json({
            id,
            name,
            email,
            role: 'user',
            status: 'active',
            phone: '',
            address: '',
            city: '',
            state: '',
            zip: '',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB Error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [
            email,
            password,
        ]);

        if (users.length > 0) {
            const user = users[0];
            if (user.status === 'inactive') {
                return res.status(403).json({ error: 'Account is Inactive. Contact Admin.' });
            }

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
                zip: user.zip || '',
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB Error' });
    }
});

app.post('/api/update-profile', async (req, res) => {
    const { id, name, email, password, phone, address, city, state, zip } = req.body;
    try {
        await db.execute(
            'UPDATE users SET name=?, email=?, password=?, phone=?, address=?, city=?, state=?, zip=? WHERE id=?',
            [name, email, password, phone, address, city, state, zip, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, role, status, created_at FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Fetch failed' });
    }
});

app.put('/api/users/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await db.execute('UPDATE users SET status=? WHERE id=?', [status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM users WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
});

// ==========================================
// 6. ABOUT PAGE CONTENT
// ==========================================

app.get('/api/about-content', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM about_content WHERE id = 1');
        if (rows.length > 0) {
            const d = rows[0];
            res.json({
                title: d.title,
                subtitle: d.subtitle,
                heroImage: d.hero_image,
                stat1Value: d.stat1_value,
                stat1Label: d.stat1_label,
                stat2Value: d.stat2_value,
                stat2Label: d.stat2_label,
                stat3Value: d.stat3_value,
                stat3Label: d.stat3_label,
                storyTitle: d.story_title,
                storyText: d.story_text,
                storyImage: d.story_image,
                craftsmanshipTitle: d.craftsmanship_title,
                craftsmanshipText: d.craftsmanship_text,
                craftsmanshipVideo: d.craftsmanship_video,
                philosophyTitle: d.philosophy_title,
                philosophySubtitle: d.philosophy_subtitle,
                value1Title: d.value1_title,
                value1Desc: d.value1_desc,
                value2Title: d.value2_title,
                value2Desc: d.value2_desc,
                value3Title: d.value3_title,
                value3Desc: d.value3_desc,
                processTitle: d.process_title,
                processStep1Title: d.step1_title,
                processStep1Desc: d.step1_desc,
                processStep1Image: d.step1_image,
                processStep2Title: d.step2_title,
                processStep2Desc: d.step2_desc,
                processStep2Image: d.step2_image,
                processStep3Title: d.step3_title,
                processStep3Desc: d.step3_desc,
                processStep3Image: d.step3_image,
            });
        } else {
            res.json(null);
        }
    } catch (err) {
        console.error('About Fetch Error:', err);
        res.status(500).json({ error: 'DB Error' });
    }
});

app.post('/api/about-content', async (req, res) => {
    const d = req.body;
    try {
        const query = `INSERT INTO about_content (
            id, title, subtitle, hero_image, stat1_value, stat1_label, stat2_value, stat2_label, stat3_value, stat3_label, 
            story_title, story_text, story_image, craftsmanship_title, craftsmanship_text, craftsmanship_video, 
            philosophy_title, philosophy_subtitle, value1_title, value1_desc, value2_title, value2_desc, value3_title, value3_desc, 
            process_title, step1_title, step1_desc, step1_image, step2_title, step2_desc, step2_image, step3_title, step3_desc, step3_image 
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
            title=VALUES(title), subtitle=VALUES(subtitle), hero_image=VALUES(hero_image), 
            stat1_value=VALUES(stat1_value), stat1_label=VALUES(stat1_label), stat2_value=VALUES(stat2_value), stat2_label=VALUES(stat2_label), stat3_value=VALUES(stat3_value), stat3_label=VALUES(stat3_label), 
            story_title=VALUES(story_title), story_text=VALUES(story_text), story_image=VALUES(story_image), 
            craftsmanship_title=VALUES(craftsmanship_title), craftsmanship_text=VALUES(craftsmanship_text), craftsmanship_video=VALUES(craftsmanship_video), 
            philosophy_title=VALUES(philosophy_title), philosophy_subtitle=VALUES(philosophy_subtitle), 
            value1_title=VALUES(value1_title), value1_desc=VALUES(value1_desc), value2_title=VALUES(value2_title), value2_desc=VALUES(value2_desc), value3_title=VALUES(value3_title), value3_desc=VALUES(value3_desc), 
            process_title=VALUES(process_title), 
            step1_title=VALUES(step1_title), step1_desc=VALUES(step1_desc), step1_image=VALUES(step1_image), 
            step2_title=VALUES(step2_title), step2_desc=VALUES(step2_desc), step2_image=VALUES(step2_image), 
            step3_title=VALUES(step3_title), step3_desc=VALUES(step3_desc), step3_image=VALUES(step3_image)`;

        const values = [
            v(d.title), v(d.subtitle), v(d.heroImage),
            v(d.stat1Value), v(d.stat1Label), v(d.stat2Value), v(d.stat2Label), v(d.stat3Value), v(d.stat3Label),
            v(d.storyTitle), v(d.storyText), v(d.storyImage),
            v(d.craftsmanshipTitle), v(d.craftsmanshipText), v(d.craftsmanshipVideo),
            v(d.philosophyTitle), v(d.philosophySubtitle),
            v(d.value1Title), v(d.value1Desc), v(d.value2Title), v(d.value2Desc), v(d.value3Title), v(d.value3Desc),
            v(d.processTitle),
            v(d.processStep1Title), v(d.processStep1Desc), v(d.processStep1Image),
            v(d.processStep2Title), v(d.processStep2Desc), v(d.processStep2Image),
            v(d.processStep3Title), v(d.processStep3Desc), v(d.processStep3Image),
        ];
        await db.execute(query, values);
        res.json({ success: true });
    } catch (err) {
        console.error('About Update Error:', err);
        res.status(500).json({ error: 'DB Error' });
    }
});

// ==========================================
// 7. HOME CONTENT
// ==========================================

app.get('/api/home-content', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM home_content WHERE id = 1');
        if (rows.length > 0) {
            const d = rows[0];
            res.json({
                heroTitle: d.hero_title,
                heroSubtitle: d.hero_subtitle,
                heroImage: d.hero_image,
                homeVideoUrl: d.home_video_url,
                marqueeText: d.marquee_text,
                trendsSectionTitle: d.trends_title,
                trendsSectionSubtitle: d.trends_subtitle,
                trend1Title: d.trend1_title,
                trend1Image: d.trend1_image,
                trend2Title: d.trend2_title,
                trend2Image: d.trend2_image,
                videoSectionTitle: d.video_section_title,
                videoSectionSubtitle: d.video_section_subtitle,
                featuredSectionTitle: d.featured_title,
                featuredSectionSubtitle: d.featured_subtitle,
                editorialTitle: d.editorial_title,
                editorialText: d.editorial_text,
                editorialImage: d.editorial_image,
                editorialVideo: d.editorial_video,
            });
        } else {
            res.json(null);
        }
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

app.post('/api/home-content', async (req, res) => {
    const d = req.body;
    try {
        const query = `INSERT INTO home_content (
            id, hero_title, hero_subtitle, hero_image, home_video_url, marquee_text, 
            trends_title, trends_subtitle, trend1_title, trend1_image, trend2_title, trend2_image, 
            video_section_title, video_section_subtitle, featured_title, featured_subtitle, 
            editorial_title, editorial_text, editorial_image, editorial_video 
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
            hero_title=VALUES(hero_title), hero_subtitle=VALUES(hero_subtitle), hero_image=VALUES(hero_image), home_video_url=VALUES(home_video_url), marquee_text=VALUES(marquee_text), 
            trends_title=VALUES(trends_title), trends_subtitle=VALUES(trends_subtitle), trend1_title=VALUES(trend1_title), trend1_image=VALUES(trend1_image), trend2_title=VALUES(trend2_title), trend2_image=VALUES(trend2_image), 
            video_section_title=VALUES(video_section_title), video_section_subtitle=VALUES(video_section_subtitle), featured_title=VALUES(featured_title), featured_subtitle=VALUES(featured_subtitle), 
            editorial_title=VALUES(editorial_title), editorial_text=VALUES(editorial_text), editorial_image=VALUES(editorial_image), editorial_video=VALUES(editorial_video)`;

        const values = [
            v(d.heroTitle), v(d.heroSubtitle), v(d.heroImage), v(d.homeVideoUrl), v(d.marqueeText),
            v(d.trendsSectionTitle), v(d.trendsSectionSubtitle), v(d.trend1Title), v(d.trend1Image), v(d.trend2Title), v(d.trend2Image),
            v(d.videoSectionTitle), v(d.videoSectionSubtitle), v(d.featuredSectionTitle), v(d.featuredSectionSubtitle),
            v(d.editorialTitle), v(d.editorialText), v(d.editorialImage), v(d.editorialVideo),
        ];
        await db.execute(query, values);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

// ==========================================
// 8. SITE SETTINGS
// ==========================================

app.get('/api/site-settings', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM site_settings WHERE id = 1');
        if (rows.length > 0) {
            const d = rows[0];
            res.json({
                brandName: d.brand_name,
                brandSubtitle: d.brand_subtitle,
                logoUrl: d.logo_url,
                footerAboutTitle: d.footer_about_title,
                footerAboutText: d.footer_about_text,
                contactEmail: d.contact_email,
                socialInstagram: d.social_instagram,
                socialFacebook: d.social_facebook,
                socialPinterest: d.social_pinterest,
                invoiceAddress: d.invoice_address,
                invoicePrefix: d.invoice_prefix,
                orderPrefix: d.order_prefix,
                logoHeight: d.logo_height || '48',
                logoWidth: d.logo_width || 'auto',
            });
        } else {
            res.json(null);
        }
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

app.post('/api/site-settings', async (req, res) => {
    const d = req.body;
    try {
        const query = `INSERT INTO site_settings (
            id, brand_name, brand_subtitle, logo_url, footer_about_title, footer_about_text, 
            contact_email, social_instagram, social_facebook, social_pinterest, 
            invoice_address, invoice_prefix, order_prefix, logo_height, logo_width 
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
            brand_name=VALUES(brand_name), brand_subtitle=VALUES(brand_subtitle), logo_url=VALUES(logo_url), 
            footer_about_title=VALUES(footer_about_title), footer_about_text=VALUES(footer_about_text), 
            contact_email=VALUES(contact_email), social_instagram=VALUES(social_instagram), 
            social_facebook=VALUES(social_facebook), social_pinterest=VALUES(social_pinterest), 
            invoice_address=VALUES(invoice_address), invoice_prefix=VALUES(invoice_prefix), 
            order_prefix=VALUES(order_prefix), logo_height=VALUES(logo_height), logo_width=VALUES(logo_width)`;

        const values = [
            v(d.brandName), v(d.brandSubtitle), v(d.logoUrl),
            v(d.footerAboutTitle), v(d.footerAboutText), v(d.contactEmail),
            v(d.socialInstagram), v(d.socialFacebook), v(d.socialPinterest),
            v(d.invoiceAddress), v(d.invoicePrefix), v(d.orderPrefix),
            v(d.logoHeight), v(d.logoWidth),
        ];

        const [result] = await db.execute(query, values);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Settings Update Error:", err);
        res.status(500).json({ error: 'Update Failed' });
    }
});

// ==========================================
// 9. GALLERY & TESTIMONIALS
// ==========================================

// Gallery
app.get('/api/gallery', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM gallery');
        res.json(rows.map((r) => ({ id: r.id, title: r.title, image: r.image_url, description: r.description })));
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

app.post('/api/gallery', async (req, res) => {
    const { id, title, image, description } = req.body;
    try {
        await db.execute('INSERT INTO gallery VALUES (?, ?, ?, ?)', [id, title, image, description]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Insert Failed' });
    }
});

app.put('/api/gallery/:id', async (req, res) => {
    const { title, image, description } = req.body;
    try {
        await db.execute('UPDATE gallery SET title=?, image_url=?, description=? WHERE id=?', [
            title,
            image,
            description,
            req.params.id,
        ]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Update Failed' });
    }
});

app.delete('/api/gallery/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM gallery WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Delete Failed' });
    }
});

// Testimonials
app.get('/api/testimonials', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM testimonials');
        res.json(rows.map((r) => ({ id: r.id, name: r.name, title: r.title, content: r.content, image: r.image_url })));
    } catch (err) {
        res.status(500).json({ error: 'Fetch failed' });
    }
});

app.post('/api/testimonials', async (req, res) => {
    const { id, name, title, content, image } = req.body;
    try {
        await db.execute('INSERT INTO testimonials VALUES (?, ?, ?, ?, ?)', [id, name, title, content, image]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Insert failed' });
    }
});

app.put('/api/testimonials/:id', async (req, res) => {
    const { name, title, content, image } = req.body;
    try {
        await db.execute('UPDATE testimonials SET name=?, title=?, content=?, image_url=? WHERE id=?', [
            name,
            title,
            content,
            image,
            req.params.id,
        ]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
});

app.delete('/api/testimonials/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM testimonials WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
});

// ==========================================
// 10. VERCEL EXPORT
// ==========================================

// Only listen if NOT running on Vercel (Local Development)
if (process.env.NODE_ENV !== 'production') {
    const PORT = 5000;
    app.listen(PORT, () => {
        console.log(`✅ Auth Server running on port ${PORT} (Local Mode)`);
    });
}

// Export for Vercel
export default app;