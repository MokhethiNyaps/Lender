Lenda (formerly Machonisa)
Product Architecture & Technical Design
Single Source of Truth for Implementation
1. Product Vision & Scope
Lenda is a mobile-first SaaS platform for informal money lending, supporting: - Solo lenders
(individuals lending their own capital) - Group lenders (stokvels) where members pool capital and lend
collectively
The system must support: - Loan lifecycle management (creation → repayment → closure) - Multiple
repayment models - Group governance and transparency - Auditability and trust - Gradual evolution
into a regulated-grade fintech platform
This document defines the authoritative system structure to be followed by: - Junior developers -
Senior engineers - AI prototypers
No architectural or data decisions should be made outside this document without updating it.
2. High-Level System Architecture
[ Mobile Web / PWA / App Shell ]
 ↓
[ Frontend Application Layer ]
 ↓ (REST / GraphQL)
[ Backend Application Layer ]
 ↓
[ Domain Services Layer ]
 ↓
[ Data Layer ]
 ↓
[ External Integrations ]
2.1 Frontend Layer
Responsibilities: - User interaction - Input validation (non-authoritative) - State management - Offline￾friendly UX (where possible)
Characteristics: - Mobile-first - Responsive (tablet & desktop adaptive) - Role-aware UI rendering
1
2.2 Backend Layer
Responsibilities: - Authentication & authorization - Business rules enforcement - Workflow
orchestration - Data integrity - Audit logging
The backend is the single source of truth for all business logic.
2.3 Domain Services Layer
Separated logical services (not necessarily microservices initially):
User & Identity Service
Group (Stokvel) Service
Loan Service
Repayment & Ledger Service
Notification Service
Reporting & Analytics Service
Each service owns its domain logic and data contracts.
2.4 Data Layer
Centralized relational database with: - Strong referential integrity - Audit fields on all entities - Soft
deletes where applicable
2.5 External Integrations
Payment providers (future-ready)
Messaging (SMS, WhatsApp, Email)
Identity verification (future)
Accounting exports (future)
Integrations must be loosely coupled via adapters.
3. User Types, Roles & Permissions
3.1 User Types
User Type Description
Solo Lender Individual lender operating alone
Group Member Member of one or more lending groups
Borrower Loan recipient (may or may not be a platform user)
Platform Admin Internal Lenda administrator
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
2
3.2 Roles (Contextual)
Roles are context-dependent.
Solo Context
Owner: Full control over their lending operation
Group Context
Group Admin
Treasurer
Secretary
Member
Read-only Observer (optional)
A single user may hold multiple roles across different groups.
3.3 Permission Model
Permissions are derived from: - User role - Context (solo vs specific group)
Examples: - Only Group Admins can add/remove members - Only Treasurers can approve
disbursements - Members can view but not edit group-wide financials
Permissions must be enforced backend-first.
4. Core Application Modules
4.1 Authentication & Identity Module
Purpose: - Secure user access - Identity management
Key Features: - Phone/email-based login - Role resolution per context - Session management
Interactions: - All modules depend on identity context
4.2 User Profile Module
Purpose: - Manage user personal and operational details
Key Flows: - Update profile - Switch context (solo ↔ group)
• 
• 
• 
• 
• 
• 
3
4.3 Group (Stokvel) Management Module
Purpose: - Create and manage lending groups
Key Features: - Group creation - Member invitations - Role assignment - Capital contribution tracking
Interactions: - Feeds Loan and Ledger modules
4.4 Borrower Management Module
Purpose: - Central registry of borrowers
Key Features: - Borrower profiles - Borrower history across loans
Borrowers are data entities, not full users by default.
4.5 Loan Management Module
Purpose: - Full loan lifecycle handling
Loan Types: - Fixed repayment - Interest-only - Principal-only - Hybrid (future)
Key Flows: 1. Loan creation 2. Approval (if group) 3. Disbursement 4. Active monitoring 5. Closure or
default
4.6 Repayment & Ledger Module
Purpose: - Financial accuracy and traceability
Key Concepts: - Immutable ledger entries - Calculated balances
All financial changes must create ledger records.
4.7 Notifications Module
Purpose: - Timely communication
Triggers: - Loan approval - Payment due - Missed payment
4.8 Reporting & Analytics Module
Purpose: - Operational and financial insights
Reports: - Portfolio health - Group performance - Individual lender summaries
4
5. Conceptual Data Model
5.1 Core Entities
User
 ├─ UserProfile
 ├─ GroupMembership
 │ └─ Role
 └─ AuditLog
Group
 ├─ GroupSettings
 ├─ GroupMemberships
 ├─ GroupLedger
 └─ Loans
Loan
 ├─ Borrower
 ├─ RepaymentSchedule
 ├─ LedgerEntries
 └─ StatusHistory
5.2 Key Design Rules
All entities include: id , created_at , updated_at , created_by
Loans cannot exist without an owner context (solo or group)
Ledger entries are append-only
6. API Boundary Definitions
6.1 API Principles
Context-aware (solo or group required)
Versioned
Explicit ownership checks
6.2 Example Boundaries
Identity API: authentication, session
Group API: membership, roles
Loan API: creation, approval, state transitions
Ledger API: read-only for UI, write-only internally
Frontend never manipulates financial state directly.
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
5
7. UI / UX Architecture (Mobile-First)
7.1 Navigation Structure
Bottom Navigation
- Home
- Loans
- Groups (if applicable)
- Reports
- Profile
Context switcher always visible.
7.2 Key Screens
Solo Lender
Dashboard
Borrowers
Loans
Reports
Group User
Group Dashboard
Members
Group Loans
Group Ledger
7.3 Reusable UI Components
Loan Card
Borrower Summary
Payment Timeline
Status Badges
Role Chips
All components must be context-aware.
8. Scalability & Future-Proofing
8.1 Scalability
Stateless backend services
Database indexing by context
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
6
Read replicas for reporting
8.2 Security
Role-based access control
Encrypted sensitive fields
Full audit logs
8.3 Future Extensions
Regulatory compliance
Credit scoring
Multi-currency
Public APIs
9. Governance Rules
This document is authoritative
Any deviation requires update + versioning
AI prototypers must treat this as specification, not suggestion
End of Architecture Document
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
7