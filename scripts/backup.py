import os
import json
import shutil
import datetime
import subprocess
import sys


def load_config(base):
    cfg_path = os.path.join(base, "config.json")
    if not os.path.exists(cfg_path):
        return None
    with open(cfg_path, "r", encoding="utf-8") as f:
        return json.load(f)


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def copy_path(src, dst):
    if os.path.isdir(src):
        if os.path.exists(dst):
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
    else:
        ensure_dir(os.path.dirname(dst))
        shutil.copy2(src, dst)


def run_git_push(base, msg):
    try:
        subprocess.check_call(["git", "add", "-A"], cwd=base)
        subprocess.check_call(["git", "commit", "-m", msg], cwd=base)
        subprocess.check_call(["git", "push"], cwd=base)
        return True, "git push ok"
    except subprocess.CalledProcessError as e:
        return False, str(e)


def main():
    base = os.path.dirname(os.path.abspath(__file__))
    # project root is parent of scripts/
    project_root = os.path.dirname(base)
    cfg = load_config(project_root)
    if not cfg:
        print(json.dumps({"ok": False, "error": "config.json not found"}, ensure_ascii=False))
        sys.exit(1)

    bcfg = cfg.get("backup", {})
    if not bcfg.get("enabled", True):
        print(json.dumps({"ok": False, "error": "backup disabled in config"}, ensure_ascii=False))
        sys.exit(0)

    paths = bcfg.get("paths", [])
    backup_dir = os.path.join(project_root, bcfg.get("backup_dir", "export/backups"))
    timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    dest_root = os.path.join(backup_dir, timestamp)
    ensure_dir(dest_root)

    results = {"copied": [], "skipped": []}
    for p in paths:
        src = os.path.join(project_root, p)
        if not os.path.exists(src):
            results["skipped"].append({"path": p, "reason": "not found"})
            continue
        dst = os.path.join(dest_root, os.path.basename(p))
        try:
            copy_path(src, dst)
            results["copied"].append(p)
        except Exception as e:
            results.setdefault("errors", []).append({"path": p, "error": str(e)})

    output = {"ok": True, "backup_folder": dest_root, "results": results}

    auto_git = bcfg.get("auto_git_push", False) or os.environ.get("AUTO_GIT_PUSH") in ("1", "true", "True")
    if auto_git:
        msg = bcfg.get("git_commit_msg", "Automated backup")
        ok, info = run_git_push(project_root, msg)
        output["git_push"] = {"ok": ok, "info": info}

    print(json.dumps(output, ensure_ascii=False))


if __name__ == "__main__":
    main()
