
export async function POST(req) {
    const res = new Response(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 });
  
    // Clear the 'token' cookie 
    res.headers.set(
      'Set-Cookie',
      'token=; Max-Age=0; Path=/; HttpOnly; Secure'
    );
  
    return res;
  }
  