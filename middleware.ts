import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('authToken'); // Get the token from cookies

    const url = req.nextUrl.clone();

    // If there's no token and user is trying to access protected routes, redirect to login
    if (!token && url.pathname.startsWith('/dashboard')) {
        url.pathname = '/authentication'; // Redirect to login page
        return NextResponse.redirect(url);
    }

    // You can add role-based protection here (e.g., check if superuser)
    if (token && url.pathname.startsWith('/dashboard/admin')) {
        const userIsSuperuser = checkUserRole(token); // Implement role checking logic
        if (!userIsSuperuser) {
            url.pathname = '/dashboard'; // Redirect non-admins to the regular dashboard
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// Helper function to check user roles (for superuser)
function checkUserRole(token) {
    // Decode the token, fetch user roles, etc.
    // Return true if the user is superuser, otherwise return false
    return true; // Simplified for the example, implement your logic here
}
