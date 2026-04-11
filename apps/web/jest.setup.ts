// apps/web/jest.setup.ts

import '@testing-library/jest-dom';

// 1. If Response is completely missing in JSDOM, mock the whole class
if (typeof global.Response === 'undefined') {
  global.Response = class MockResponse {
    body: any;
    status: number;
    
    constructor(body: any, init?: any) {
      this.body = body;
      this.status = init?.status || 200;
    }

    // Allows us to do `await res.json()` in our tests
    async json() {
      return JSON.parse(this.body);
    }

    // Allows Next.js to do `NextResponse.json(...)`
    static json(data: any, init?: any) {
      return new MockResponse(JSON.stringify(data), init);
    }
  } as any;
} 
// 2. If Response exists but is just missing the .json() static method
else if (!global.Response.json) {
  global.Response.json = function (data: any, init?: any) {
    return new global.Response(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  };
}