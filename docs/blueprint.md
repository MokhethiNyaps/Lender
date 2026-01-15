# **App Name**: Lenda

## Core Features:

- User Authentication: Implement phone and email based authentication with secure password storage and account management.
- User Identity and Profiles: Define a 'Users' collection with fields: id, created_at, updated_at, and created_by.  Include a UserProfile sub-collection for extended user details.
- Context-Aware Roles: Implement a system where users can have multiple roles (Owner, Admin, Member, etc.) across different lending contexts (Solo Lender, Group Member/Stokvel). Ensure the 'Context' is explicitly linked to a GroupID or a SoloID.
- Backend-First Security Rules: Ensure all security rules are derived from the User Role and Context, managed and enforced on the backend. A user’s permissions must be checked against the specific entity they are interacting with.
- Append-Only Ledger: Ensure the architecture is ready for an Append-Only Ledger. No financial state (like a loan balance) should be editable without a corresponding ledger entry.

## Style Guidelines:

- Primary color: Soft blue (#64B5F6) to inspire trust and security.
- Background color: Very light blue (#E3F2FD) for a clean and calming feel.
- Accent color: Warm orange (#FFB74D) to highlight important actions and calls to action.
- Body and headline font: 'PT Sans' (sans-serif) combines modernity and a touch of warmth, suitable for both headlines and body text.
- Use simple, modern icons that represent lending, groups, and roles.
- Design a mobile-first layout with a clear hierarchy of information.
- Use subtle animations to enhance user experience, such as loading indicators and transition effects.