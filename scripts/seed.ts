import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../lib/mongodb';
import {
  User,
  Company,
  Job,
  Application,
  Interview,
  Feedback,
  Assessment,
  Offer,
  Notification,
  AuditLog,
} from '../models';

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Interview.deleteMany({});
    await Feedback.deleteMany({});
    await Assessment.deleteMany({});
    await Offer.deleteMany({});
    await Notification.deleteMany({});
    await AuditLog.deleteMany({});
    console.log('Existing data cleared');

    // Hash passwords
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create Companies
    console.log('Creating companies...');
    const companies = await Company.create([
      {
        name: 'Northstar Labs',
        slug: 'northstar-labs',
        description: 'Innovative B2B SaaS company focused on growth products and user experience.',
        website: 'https://northstar.ai',
        industry: 'Technology',
        size: '51-200',
        location: 'Remote • US',
        foundedYear: 2019,
        socialLinks: {
          linkedin: 'https://linkedin.com/company/northstar-labs',
          twitter: '@northstarlabs',
        },
      },
      {
        name: 'Runway Cloud',
        slug: 'runway-cloud',
        description: 'AI-powered workflow automation platform for enterprise teams.',
        website: 'https://runway.cloud',
        industry: 'Technology',
        size: '201-500',
        location: 'New York, NY',
        foundedYear: 2020,
        socialLinks: {
          linkedin: 'https://linkedin.com/company/runway-cloud',
        },
      },
      {
        name: 'Metric Forge',
        slug: 'metric-forge',
        description: 'Revenue operations and sales intelligence platform.',
        website: 'https://metricforge.com',
        industry: 'Technology',
        size: '11-50',
        location: 'Austin, TX',
        foundedYear: 2021,
      },
    ]);
    console.log(`Created ${companies.length} companies`);

    // Create Users
    console.log('Creating users...');
    const users = await User.create([
      {
        name: 'Ava Rodriguez',
        email: 'ava@northstar.ai',
        password: passwordHash,
        role: 'candidate',
        isEmailVerified: true,
        profile: {
          title: 'Senior Product Designer',
          phone: '+1-555-0101',
          location: 'San Francisco, CA',
          linkedin: 'https://linkedin.com/in/avarodriguez',
          github: 'https://github.com/avarodriguez',
          bio: 'Passionate product designer with 7 years of experience in B2B SaaS.',
          skills: ['UX Research', 'Figma', 'Design Systems', 'Product Strategy', 'B2B SaaS', 'User Interviews'],
          experience: [
            {
              company: 'TechCorp Inc',
              position: 'Product Designer',
              startDate: new Date('2020-01-01'),
              current: true,
              description: 'Led design system initiatives and UX research for core products.',
            },
            {
              company: 'StartupXYZ',
              position: 'UX Designer',
              startDate: new Date('2018-06-01'),
              endDate: new Date('2019-12-31'),
              current: false,
              description: 'Designed mobile-first interfaces for fintech application.',
            },
          ],
          education: [
            {
              institution: 'Stanford University',
              degree: 'Bachelor of Arts',
              field: 'Human-Computer Interaction',
              startDate: new Date('2014-09-01'),
              endDate: new Date('2018-05-31'),
              current: false,
            },
          ],
        },
      },
      {
        name: 'Olivia Chen',
        email: 'olivia@hirelens.ai',
        password: passwordHash,
        role: 'recruiter',
        companyId: companies[0]._id,
        isEmailVerified: true,
        profile: {
          title: 'Senior Technical Recruiter',
          phone: '+1-555-0102',
          location: 'Remote',
          linkedin: 'https://linkedin.com/in/oliviachen',
          bio: 'Experienced recruiter specializing in technical talent acquisition.',
        },
      },
      {
        name: 'Admin User',
        email: 'admin@hirelens.ai',
        password: passwordHash,
        role: 'admin',
        isEmailVerified: true,
        profile: {
          title: 'System Administrator',
          bio: 'Platform administrator with full system access.',
        },
      },
      {
        name: 'Moderator User',
        email: 'moderator@hirelens.ai',
        password: passwordHash,
        role: 'moderator',
        isEmailVerified: true,
        profile: {
          title: 'Content Moderator',
          bio: 'Platform moderator with content management access.',
        },
      },
      {
        name: 'Super Admin',
        email: 'superadmin@hirelens.ai',
        password: passwordHash,
        role: 'superadmin',
        isEmailVerified: true,
        profile: {
          title: 'Super Administrator',
          bio: 'Platform super administrator with full system access.',
        },
      },
    ]);
    console.log(`Created ${users.length} users`);

    // Create Jobs
    console.log('Creating jobs...');
    const jobs = await Job.create([
      {
        title: 'Senior Product Designer',
        slug: 'senior-product-designer-northstar',
        companyId: companies[0]._id,
        recruiterId: users[1]._id,
        description: 'Lead UX strategy for B2B SaaS growth products with a strong focus on research, design systems, and cross-functional product delivery.',
        requirements: ['UX Research', 'Figma', 'Design Systems', 'Product Strategy', 'B2B SaaS', 'User Interviews'],
        responsibilities: [
          'Lead design system initiatives',
          'Conduct user research and usability testing',
          'Collaborate with product and engineering teams',
          'Mentor junior designers',
        ],
        benefits: ['Remote work', 'Health insurance', '401k matching', 'Learning budget'],
        location: 'Remote • US',
        type: 'Full-time',
        workMode: 'Remote',
        salary: {
          min: 140000,
          max: 170000,
          currency: 'USD',
          period: 'yearly',
          display: '$140k - $170k',
        },
        department: 'Product',
        experienceLevel: 'Senior',
        skills: ['UX Research', 'Figma', 'Design Systems', 'Product Strategy', 'B2B SaaS', 'User Interviews'],
        status: 'Open',
        publishedAt: new Date(),
        settings: {
          allowRemote: true,
          visaSponsorship: false,
          urgent: false,
        },
      },
      {
        title: 'Senior Frontend Engineer',
        slug: 'senior-frontend-engineer-runway',
        companyId: companies[1]._id,
        recruiterId: users[1]._id,
        description: 'Build modern frontend architecture for AI workflows, performance optimization, and highly scalable interfaces.',
        requirements: ['React', 'TypeScript', 'Performance', 'GraphQL', 'Testing', 'UI Architecture'],
        responsibilities: [
          'Architect and implement frontend solutions',
          'Optimize application performance',
          'Write comprehensive tests',
          'Collaborate with backend team',
        ],
        benefits: ['Competitive salary', 'Equity package', 'Remote flexibility', 'Health benefits'],
        location: 'New York, NY',
        type: 'Full-time',
        workMode: 'Hybrid',
        salary: {
          min: 160000,
          max: 195000,
          currency: 'USD',
          period: 'yearly',
          display: '$160k - $195k',
        },
        department: 'Engineering',
        experienceLevel: 'Senior',
        skills: ['React', 'TypeScript', 'Performance', 'GraphQL', 'Testing', 'UI Architecture'],
        status: 'Open',
        publishedAt: new Date(),
        settings: {
          allowRemote: true,
          visaSponsorship: true,
          urgent: true,
        },
      },
      {
        title: 'Revenue Operations Manager',
        slug: 'revenue-operations-manager-metric-forge',
        companyId: companies[2]._id,
        recruiterId: users[1]._id,
        description: 'Own forecasting, pipeline reporting, and sales process optimization across the GTM team.',
        requirements: ['Sales Operations', 'CRM', 'Forecasting', 'Excel', 'Pipeline Reporting', 'Process Design'],
        responsibilities: [
          'Manage sales forecasting and reporting',
          'Optimize sales processes',
          'Maintain CRM data integrity',
          'Analyze pipeline metrics',
        ],
        benefits: ['Base + bonus', 'Health insurance', 'Remote work', 'Professional development'],
        location: 'Austin, TX',
        type: 'Full-time',
        workMode: 'Hybrid',
        salary: {
          min: 120000,
          max: 148000,
          currency: 'USD',
          period: 'yearly',
          display: '$120k - $148k',
        },
        department: 'Operations',
        experienceLevel: 'Mid',
        skills: ['Sales Operations', 'CRM', 'Forecasting', 'Excel', 'Pipeline Reporting', 'Process Design'],
        status: 'Open',
        publishedAt: new Date(),
        settings: {
          allowRemote: false,
          visaSponsorship: false,
          urgent: false,
        },
      },
    ]);
    console.log(`Created ${jobs.length} jobs`);

    // Create Applications
    console.log('Creating applications...');
    const applications = await Application.create([
      {
        jobId: jobs[0]._id,
        candidateId: users[0]._id,
        recruiterId: users[1]._id,
        candidateName: 'Ava Rodriguez',
        candidateEmail: 'ava@northstar.ai',
        resume: {
          originalName: 'ava_rodriguez_resume.pdf',
          storedName: 'ava_rodriguez_resume_20240820.pdf',
          url: '/resumes/ava_rodriguez_resume_20240820.pdf',
          size: 245000,
          mimeType: 'application/pdf',
        },
        resumeText: 'Senior Product Designer with 7 years of experience in B2B SaaS, UX research, design systems, product strategy, and user interviews. Proficient in Figma, user research methodologies, and design system development.',
        coverLetter: 'I am excited to apply for the Senior Product Designer position at Northstar Labs. With my background in B2B SaaS and passion for user-centered design, I believe I would be a great fit for your team.',
        aiAnalysis: {
          score: 94,
          strengths: ['UX Research', 'Design Systems', 'B2B SaaS'],
          missingSkills: ['A/B Experimentation', 'Accessibility Audits'],
          suggestions: ['Strengthen quantitative product storytelling.', 'Highlight accessibility and experimentation work.'],
          analyzedAt: new Date(),
          modelUsed: 'gpt-4o-mini',
        },
        status: 'Shortlisted',
        source: 'direct',
        appliedAt: new Date('2024-08-15'),
        statusHistory: [
          {
            status: 'Applied',
            changedBy: users[0]._id,
            changedAt: new Date('2024-08-15'),
          },
          {
            status: 'Shortlisted',
            changedBy: users[1]._id,
            changedAt: new Date('2024-08-16'),
            notes: 'Strong portfolio and relevant experience',
          },
        ],
      },
    ]);
    console.log(`Created ${applications.length} applications`);

    // Create Interview
    console.log('Creating interviews...');
    const interviews = await Interview.create([
      {
        applicationId: applications[0]._id,
        jobId: jobs[0]._id,
        candidateId: users[0]._id,
        recruiterId: users[1]._id,
        type: 'Video',
        status: 'Scheduled',
        scheduledDate: new Date('2024-08-25T14:00:00Z'),
        duration: 45,
        meetingLink: 'https://zoom.us/j/123456789',
        meetingId: '123456789',
        meetingPassword: 'hirelens2024',
        interviewers: [
          {
            userId: users[1]._id,
            name: 'Olivia Chen',
            role: 'Senior Technical Recruiter',
          },
        ],
        notes: 'Initial screening interview to discuss portfolio and experience',
        reminderSent: false,
      },
    ]);
    console.log(`Created ${interviews.length} interviews`);

    // Create Feedback
    console.log('Creating feedback...');
    const feedback = await Feedback.create([
      {
        applicationId: applications[0]._id,
        interviewId: interviews[0]._id,
        candidateId: users[0]._id,
        interviewerId: users[1]._id,
        type: 'interview',
        rating: {
          overall: 4,
          communication: 5,
          technical: 4,
          culture: 5,
          potential: 4,
        },
        strengths: ['Excellent communication skills', 'Strong design portfolio', 'Good cultural fit'],
        weaknesses: ['Limited experience with A/B testing'],
        recommendations: ['Proceed to next round', 'Technical assessment recommended'],
        notes: 'Ava showed great potential and alignment with our team culture. Her portfolio demonstrates strong design thinking and execution.',
        isHireRecommended: true,
        wouldProceed: true,
      },
    ]);
    console.log(`Created ${feedback.length} feedback entries`);

    // Create Assessment
    console.log('Creating assessments...');
    const assessments = await Assessment.create([
      {
        applicationId: applications[0]._id,
        jobId: jobs[0]._id,
        candidateId: users[0]._id,
        recruiterId: users[1]._id,
        type: 'take-home',
        title: 'Design Challenge',
        description: 'Complete a design challenge based on a real product scenario',
        instructions: 'You will be given a product brief and asked to create a design solution within 5 days.',
        timeLimit: 240, // 4 hours
        deadline: new Date('2024-08-30'),
        status: 'Pending',
        maxScore: 100,
        passingScore: 70,
        questions: [],
        answers: [],
        notes: 'This will help us evaluate your design process and problem-solving skills.',
      },
    ]);
    console.log(`Created ${assessments.length} assessments`);

    // Create Notification
    console.log('Creating notifications...');
    const notifications = await Notification.create([
      {
        userId: users[0]._id,
        type: 'interview',
        title: 'Interview Scheduled',
        message: 'Your interview for Senior Product Designer at Northstar Labs is scheduled for August 25, 2024 at 2:00 PM.',
        status: 'unread',
        actionUrl: '/interviews',
        relatedId: {
          model: 'Interview',
          id: interviews[0]._id,
        },
        priority: 'high',
        metadata: {
          interviewDate: '2024-08-25T14:00:00Z',
          meetingLink: 'https://zoom.us/j/123456789',
        },
      },
      {
        userId: users[1]._id,
        type: 'application',
        title: 'New Application Received',
        message: 'Ava Rodriguez has applied for Senior Product Designer position.',
        status: 'unread',
        actionUrl: '/recruiter/candidates',
        relatedId: {
          model: 'Application',
          id: applications[0]._id,
        },
        priority: 'normal',
      },
    ]);
    console.log(`Created ${notifications.length} notifications`);

    // Create Audit Log entries
    console.log('Creating audit logs...');
    const auditLogs = await AuditLog.create([
      {
        userId: users[0]._id,
        action: 'create',
        entity: 'application',
        entityId: applications[0]._id,
        details: {
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          metadata: {
            jobId: jobs[0]._id,
          },
        },
        timestamp: new Date('2024-08-15'),
      },
      {
        userId: users[1]._id,
        action: 'update',
        entity: 'application',
        entityId: applications[0]._id,
        details: {
          ip: '192.168.1.2',
          userAgent: 'Mozilla/5.0',
          changes: {
            status: { old: 'Applied', new: 'Shortlisted' },
          },
        },
        timestamp: new Date('2024-08-16'),
      },
    ]);
    console.log(`Created ${auditLogs.length} audit log entries`);

    console.log('Seed data created successfully!');
    console.log('\nSeed accounts:');
    console.log('Candidate: ava@northstar.ai / password123');
    console.log('Recruiter: olivia@hirelens.ai / password123');
    console.log('Admin: admin@hirelens.ai / password123');
    console.log('Moderator: moderator@hirelens.ai / password123');
    console.log('Super Admin: superadmin@hirelens.ai / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
