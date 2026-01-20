from playwright.sync_api import sync_playwright
import time
import os

def run():
    print("Starting verification with console logging...")
    current_dir = os.getcwd()
    file_url = f"file://{current_dir}/dnd-kit-react-tailwind/dist/index.html"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Subscribe to console events
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        print(f"Navigating to {file_url}")
        page.goto(file_url)

        try:
            page.wait_for_selector("text=Site Builder", timeout=3000)
            print("SUCCESS: App rendered.")
        except Exception as e:
            print(f"FAILURE: App did not render within timeout. {e}")

        browser.close()

if __name__ == "__main__":
    run()
