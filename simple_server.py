#!/usr/bin/env python3
import http.server
import socketserver
import os

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

# تغيير إلى مجلد التطبيق
os.chdir('/home/user/webapp')

PORT = 3001
Handler = MyHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🌐 الخدمة تعمل على http://localhost:{PORT}")
    print("📂 الخدمة من مجلد: /home/user/webapp")
    httpd.serve_forever()