# Release Verification Checklist

## 1. Foundation

- [ ] Install client and server dependencies on the deployment machine
- [ ] Create the production PostgreSQL database
- [ ] Configure production environment variables
- [ ] Run the production Prisma migration
- [ ] Seed and verify the first administrator

## 2. Authentication

- [ ] Student registration
- [ ] Shared login
- [ ] Current-user endpoint
- [ ] Logout and session destruction
- [ ] Role middleware
- [ ] Account status checks
- [ ] CSRF protection and login rate limiting

## 3. Public site

- [ ] Home page
- [ ] About page
- [ ] Course catalogue
- [ ] Course details
- [ ] Contact page

## 4. Admin

- [ ] Dashboard statistics
- [ ] Student management
- [ ] Tutor creation and deactivation
- [ ] Password setup links
- [ ] Course management
- [ ] Tutor assignment
- [ ] Pending enrollment queue
- [ ] Approve, reject, suspend, and restore enrollment

## 5. Tutor

- [ ] Assigned courses
- [ ] Module management
- [ ] Lesson management
- [ ] Assigned-course authorization
- [ ] Enrolled student list

## 6. Student

- [ ] Enrollment request
- [ ] Enrollment status display
- [ ] Active course access
- [ ] Locked pending courses
- [ ] Lesson completion
- [ ] Course progress

## 7. Release

- [ ] Automated API tests
- [ ] Authorization attack tests
- [ ] Responsive UI review
- [ ] Production database and migrations
- [ ] HTTPS and secure cookies
- [ ] Email provider
- [ ] Backups and monitoring
