from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
print("Serving at http://localhost:8000")
ThreadingHTTPServer(("127.0.0.1",8000),SimpleHTTPRequestHandler).serve_forever()
