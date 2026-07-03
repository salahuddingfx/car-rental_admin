# Security Policy

## Reporting a Vulnerability

The Apex Ride team takes security seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **salahuddin@nextora.studio**

You should receive a response within 48 hours. If for some reason you do not, please follow up to ensure we received your original message.

### What to Include

Please include the following information in your report:

- Type of vulnerability (e.g., XSS, CSRF, etc.)
- Full paths of source file(s) related to the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact assessment

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt of your report within 48 hours
- **Assessment**: We'll validate the vulnerability and determine its impact
- **Resolution**: We'll work on a fix and coordinate disclosure timing
- **Credit**: With your permission, we'll acknowledge your contribution

## Security Update Process

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any potential similar problems
3. Prepare fixes for all releases still under maintenance
4. Release patched versions as soon as possible
5. Publish a security advisory on GitHub

## Security Considerations

### Client-Side Security

This is a client-side application that uses browser localStorage for data persistence. Users should be aware:

- **Data Storage**: All data is stored in the browser's localStorage
- **No Server**: There is no backend server; all operations happen client-side
- **Data Persistence**: Clearing browser data will remove all saved information
- **Shared Computers**: Always log out when using shared or public computers

### Authentication

- Authentication is currently simulated (client-side only)
- No real user credentials are transmitted to any server
- Session data persists in localStorage until manually cleared

### Third-Party Dependencies

We regularly update dependencies to patch known vulnerabilities:

```bash
# Check for vulnerable dependencies
npm audit

# Fix vulnerabilities when possible
npm audit fix
```

### Content Security

- User inputs are validated on the client side
- XSS prevention through React's default escaping
- No user-generated HTML content is rendered unsanitized

## Best Practices for Users

1. **Keep your browser updated** to the latest version
2. **Clear localStorage** if you suspect any unauthorized access
3. **Don't share your browser session** on shared computers
4. **Use strong passwords** if backend authentication is implemented
5. **Report suspicious behavior** immediately

## Scope

This security policy applies to:

- The admin panel application code
- Configuration files
- Build scripts and tooling

It does NOT apply to:

- Third-party dependencies (report upstream)
- The underlying browser security model
- Physical security of development machines

## Contact

For any security-related questions or concerns:

- **Email**: salahuddin@nextora.studio
- **GitHub**: [github.com/salahuddingfx/car-rental_admin](https://github.com/salahuddingfx/car-rental_admin)

## Changes to This Policy

We may update this security policy from time to time. Changes will be posted in the repository and the updated date will be reflected at the top of this file.

---

**Last Updated:** July 2026
