import http.server
import socketserver
import webbrowser
import os
import json
import subprocess
import sys
from urllib import parse

PORT = 3000


class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def _send_json(self, obj, status=200):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        parsed = parse.urlparse(self.path)
        if parsed.path == "/styles":
            try:
                here = os.path.dirname(os.path.abspath(__file__))
                style_dir = os.path.join(here, "style")
                files = []
                if os.path.exists(style_dir):
                    for f in os.listdir(style_dir):
                        if f.lower().endswith('.json'):
                            files.append(f)
                self._send_json({"ok": True, "files": files})
            except Exception as e:
                self._send_json({"ok": False, "error": str(e)}, status=500)
            return
        if parsed.path == "/config":
            try:
                here = os.path.dirname(os.path.abspath(__file__))
                cfg_path = os.path.join(here, "config.json")
                with open(cfg_path, "r", encoding="utf-8") as f:
                    cfg = json.load(f)
                # remove secrets before returning
                safe_cfg = json.loads(json.dumps(cfg))
                claude = safe_cfg.get("claude", {})
                if "api_key" in claude:
                    claude["api_key"] = "<redacted>"
                self._send_json({"ok": True, "config": safe_cfg})
            except Exception as e:
                self._send_json({"ok": False, "error": str(e)}, status=500)
            return

        if parsed.path == "/backup":
            try:
                here = os.path.dirname(os.path.abspath(__file__))
                script = os.path.join(here, "scripts", "backup.py")
                if not os.path.exists(script):
                    raise FileNotFoundError("backup script not found")
                proc = subprocess.run([sys.executable, script], capture_output=True, text=True, cwd=here)
                if proc.returncode != 0:
                    raise RuntimeError(proc.stderr or proc.stdout)
                self._send_json({"ok": True, "output": proc.stdout})
            except Exception as e:
                self._send_json({"ok": False, "error": str(e)}, status=500)
            return

        return super().do_GET()


Handler = CustomHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    print(f"Press Ctrl+C to stop the server")
    print()
    print("Opening browser...")

    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    webbrowser.open(f"http://localhost:{PORT}")

    httpd.serve_forever()
