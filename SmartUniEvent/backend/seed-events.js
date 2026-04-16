require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const events = [
  // Academic Events
  {
    title: 'Annual Research Symposium 2026',
    description: 'Join us for our prestigious annual research symposium featuring groundbreaking presentations from graduate students and faculty across all disciplines. Network with leading researchers and discover innovative projects.',
    category: 'academic',
    date: '2026-05-20',
    time: '09:00:00',
    location: 'Main Auditorium - Science Building',
    price: 0.00,
    total_tickets: 500,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Guest Lecture: Future of AI',
    description: 'Renowned AI researcher Dr. Sarah Chen will discuss the latest developments in artificial intelligence and machine learning. Learn about cutting-edge research and career opportunities in AI.',
    category: 'academic',
    date: '2026-05-25',
    time: '14:00:00',
    location: 'Engineering Auditorium',
    price: 0.00,
    total_tickets: 300,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Career Fair 2026',
    description: 'Meet with representatives from over 100 companies seeking talented graduates. Bring your resume and explore internship and full-time opportunities in various industries.',
    category: 'academic',
    date: '2026-06-10',
    time: '10:00:00',
    location: 'University Convention Center',
    price: 0.00,
    total_tickets: 1000,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Medical Conference: Healthcare Innovation',
    description: 'A comprehensive conference on modern healthcare practices, medical technology innovations, and patient care improvements. CME credits available.',
    category: 'academic',
    date: '2026-06-15',
    time: '08:00:00',
    location: 'Medical School Lecture Hall',
    price: 35.00,
    total_tickets: 200,
    image_url: null,
    status: 'active'
  },

  // Social Events
  {
    title: 'Spring Gala 2026',
    description: 'The most anticipated event of the year! Join us for an elegant evening of music, dancing, and entertainment. Dress code: Semi-formal. Includes dinner and live band performance.',
    category: 'social',
    date: '2026-05-15',
    time: '19:00:00',
    location: 'University Main Hall',
    price: 35.00,
    total_tickets: 500,
    image_url: null,
    status: 'active'
  },
  {
    title: 'International Cultural Night',
    description: 'Celebrate diversity with performances, food, and exhibitions from students representing over 50 countries. Experience music, dance, and cuisine from around the world.',
    category: 'social',
    date: '2026-05-28',
    time: '18:00:00',
    location: 'Student Union Plaza',
    price: 15.00,
    total_tickets: 800,
    image_url: null,
    status: 'active'
  },
  {
    title: 'End of Year Beach Party',
    description: 'Celebrate the end of the academic year with a beach party featuring live DJ, games, food trucks, and bonfire. Transportation provided from campus.',
    category: 'social',
    date: '2026-06-20',
    time: '16:00:00',
    location: 'Ocean View Beach',
    price: 25.00,
    total_tickets: 600,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Comedy Night at Campus',
    description: 'Laugh out loud with professional comedians and talented student performers. A night of stand-up comedy, improv, and sketch performances.',
    category: 'social',
    date: '2026-05-18',
    time: '20:00:00',
    location: 'Theater Arts Building',
    price: 10.00,
    total_tickets: 250,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Summer Music Festival',
    description: 'Three stages, twelve bands, one unforgettable night! Featuring local and national artists across multiple genres. Food vendors and art installations included.',
    category: 'social',
    date: '2026-06-25',
    time: '17:00:00',
    location: 'Campus Green',
    price: 40.00,
    total_tickets: 1500,
    image_url: null,
    status: 'active'
  },

  // Sports Events
  {
    title: 'Football Championship Finals',
    description: 'The ultimate showdown! Watch our university team compete for the championship title. Witness intense competition and show your school spirit!',
    category: 'sports',
    date: '2026-05-22',
    time: '16:00:00',
    location: 'University Stadium',
    price: 20.00,
    total_tickets: 2000,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Basketball Tournament - Semi Finals',
    description: 'Inter-university basketball tournament featuring the top 4 teams. High-energy games with professional commentary and halftime entertainment.',
    category: 'sports',
    date: '2026-05-30',
    time: '18:00:00',
    location: 'Sports Complex Arena',
    price: 15.00,
    total_tickets: 1200,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Annual Marathon & Fun Run',
    description: 'Participate or cheer on runners in our annual marathon. Multiple categories: 5K, 10K, Half Marathon, and Full Marathon. Registration includes t-shirt and medal.',
    category: 'sports',
    date: '2026-06-05',
    time: '07:00:00',
    location: 'Campus to City Center Route',
    price: 30.00,
    total_tickets: 800,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Swimming Championship',
    description: 'Regional swimming championship featuring Olympic-size pool competitions. Watch future champions compete in various swimming styles and distances.',
    category: 'sports',
    date: '2026-06-12',
    time: '14:00:00',
    location: 'Aquatic Center',
    price: 12.00,
    total_tickets: 500,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Tennis Open Tournament',
    description: 'Annual tennis tournament open to students and faculty. Singles and doubles categories. Watch competitive matches on professional courts.',
    category: 'sports',
    date: '2026-05-27',
    time: '10:00:00',
    location: 'Tennis Courts Complex',
    price: 8.00,
    total_tickets: 300,
    image_url: null,
    status: 'active'
  },

  // Workshops & Training
  {
    title: 'Coding Bootcamp: Web Development',
    description: 'Intensive 2-day workshop covering HTML, CSS, JavaScript, and React. Hands-on projects and certificate upon completion. Laptops required.',
    category: 'academic',
    date: '2026-05-16',
    time: '09:00:00',
    location: 'Computer Science Lab 201',
    price: 50.00,
    total_tickets: 50,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Entrepreneurship Workshop',
    description: 'Learn how to start and grow your own business. Topics include business planning, funding, marketing, and legal considerations. Led by successful entrepreneurs.',
    category: 'academic',
    date: '2026-06-08',
    time: '13:00:00',
    location: 'Business School Room 305',
    price: 25.00,
    total_tickets: 100,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Photography Workshop: Portrait Mastery',
    description: 'Professional photographer teaches advanced portrait photography techniques. Includes lighting, composition, and post-processing. Bring your camera.',
    category: 'social',
    date: '2026-05-24',
    time: '15:00:00',
    location: 'Art Studio Building',
    price: 30.00,
    total_tickets: 40,
    image_url: null,
    status: 'active'
  },

  // Arts & Culture
  {
    title: 'Spring Theater Production: Hamlet',
    description: 'Our drama department presents Shakespeare\'s timeless tragedy. Featuring talented student actors in a modern interpretation of this classic play.',
    category: 'social',
    date: '2026-05-19',
    time: '19:30:00',
    location: 'University Theater',
    price: 18.00,
    total_tickets: 400,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Art Exhibition: Student Showcase',
    description: 'Annual exhibition featuring paintings, sculptures, photography, and digital art by talented students. Meet the artists at the opening reception.',
    category: 'social',
    date: '2026-06-01',
    time: '17:00:00',
    location: 'University Art Gallery',
    price: 0.00,
    total_tickets: 300,
    image_url: null,
    status: 'active'
  },
  {
    title: 'Classical Music Concert',
    description: 'The university orchestra performs masterpieces by Mozart, Beethoven, and Tchaikovsky. A sophisticated evening of classical music.',
    category: 'social',
    date: '2026-06-18',
    time: '20:00:00',
    location: 'Concert Hall',
    price: 22.00,
    total_tickets: 350,
    image_url: null,
    status: 'active'
  }
];

async function seedEvents() {
  try {
    console.log('🌱 Starting to seed events...\n');

    // Get admin user ID
    const adminResult = await pool.query(
      "SELECT id FROM users WHERE email = 'admin@university.edu'"
    );

    if (adminResult.rows.length === 0) {
      console.error('❌ Admin user not found. Please create admin user first.');
      process.exit(1);
    }

    const adminId = adminResult.rows[0].id;
    console.log('✅ Found admin user:', adminId);

    // Clear existing events (optional - comment out if you want to keep existing)
    // await pool.query('DELETE FROM events WHERE created_by = $1', [adminId]);
    // console.log('🗑️  Cleared existing events\n');

    let successCount = 0;
    let skipCount = 0;

    for (const event of events) {
      try {
        // Check if event already exists
        const existing = await pool.query(
          'SELECT id FROM events WHERE title = $1',
          [event.title]
        );

        if (existing.rows.length > 0) {
          console.log(`⏭️  Skipping: "${event.title}" (already exists)`);
          skipCount++;
          continue;
        }

        await pool.query(
          `INSERT INTO events (
            title, description, category, date, time, location,
            price, total_tickets, available_tickets, image_url, status, created_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            event.title,
            event.description,
            event.category,
            event.date,
            event.time,
            event.location,
            event.price,
            event.total_tickets,
            event.total_tickets, // available_tickets = total_tickets initially
            event.image_url,
            event.status,
            adminId
          ]
        );

        console.log(`✅ Added: "${event.title}" (${event.category}) - $${event.price}`);
        successCount++;
      } catch (err) {
        console.error(`❌ Error adding "${event.title}":`, err.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Successfully added: ${successCount} events`);
    console.log(`   ⏭️  Skipped (duplicates): ${skipCount} events`);
    console.log(`   📝 Total events in database: ${successCount + skipCount}`);

    // Show events by category
    const categoryStats = await pool.query(`
      SELECT category, COUNT(*) as count, SUM(total_tickets) as total_tickets
      FROM events
      WHERE status = 'active'
      GROUP BY category
      ORDER BY category
    `);

    console.log('\n📈 Events by Category:');
    categoryStats.rows.forEach(stat => {
      console.log(`   ${stat.category}: ${stat.count} events (${stat.total_tickets} total tickets)`);
    });

    await pool.end();
    console.log('\n✨ Seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    await pool.end();
    process.exit(1);
  }
}

seedEvents();
