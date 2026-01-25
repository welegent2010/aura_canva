import http.server
import socketserver

PORT = 3000

Handler = http.server.SimpleHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print(f"Press Ctrl+C to stop")
        httpd.serve_forever()
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
