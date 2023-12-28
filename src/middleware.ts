import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { verify } from "@/utils/jwt";

export async function middleware(request: NextRequest) {
	const pathname: any = request.nextUrl.pathname;
	const cookie: any = request.cookies.get('admin');

	if(pathname.startsWith("/admin/dashboard")) {
		if(cookie) {
			const { value }: { value: string } = cookie;
			const jwt = verify(value);

			if(jwt) {
				return NextResponse.next();
			}
			else {
				return NextResponse.redirect(new URL('/admin/sign-in', request.url))
				// return NextResponse.next();
			}
		}
		else {
			return NextResponse.redirect(new URL('/admin/sign-in', request.url))
			// return NextResponse.next();
		}
	}
	else if(pathname.startsWith("/admin/sign-in")) {
		if(cookie) {
			const { value }: { value: string } = cookie;
			const jwt = verify(value);

			if(jwt) {
				return NextResponse.redirect(new URL('/admin/dashboard', request.url))
			}
		
			return NextResponse.next();
		}

		return NextResponse.next();
	}
}

export const config = {
	matcher: [
		'/admin/:path*',
		'/api/:path*',
	]
}