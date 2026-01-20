from playwright.sync_api import sync_playwright
import time
import os

def run():
    print("Starting verification...")
    current_dir = os.getcwd()

    # Path to the build output
    file_url = f"file://{current_dir}/dnd-kit-react-tailwind/dist/index.html"

    with sync_playwright() as p:
        # Set a large viewport to ensure desktop view
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print(f"Navigating to {file_url}")
        page.goto(file_url)

        # 1. Verify Header
        print("Verifying Header...")
        # Wait for React to mount
        try:
            page.wait_for_selector("text=Site Builder", timeout=5000)
            print("Header title found.")
        except Exception as e:
            print(f"Error finding header: {e}")
            page.screenshot(path="debug_screenshot.png")
            # Continue anyway to check other things? No, if header is missing, app might be broken.
            raise e

        # 2. Verify Sidebar Nav (New Architecture)
        print("Verifying Sidebar Nav...")
        commerce_btn = page.locator("button:has-text('Commerce')")
        commerce_btn.wait_for(state="visible", timeout=5000)

        # 3. Open Drawer
        print("Opening Sidebar Drawer...")
        commerce_btn.click()

        time.sleep(1) # Animation
        hero_product = page.locator("text=Hero Product")
        assert hero_product.is_visible(), "Hero Product thumbnail not visible after opening drawer"

        # 4. Close Drawer
        print("Closing Sidebar Drawer...")
        close_btn = page.locator("button:has(.lucide-x)")
        if close_btn.count() > 0:
            close_btn.first.click()
        else:
            commerce_btn.click()

        time.sleep(1)

        # 5. Drag and Drop
        print("Testing Drag and Drop...")
        commerce_btn.click()
        time.sleep(0.5)

        source = page.locator("text=Hero Product").first
        target = page.locator("#canvas-droppable")

        source.drag_to(target)

        time.sleep(1)
        # Check if something was added.
        # For Hero Product, maybe check for text "Shop Now" or specific content
        # Or just check children count of canvas
        canvas = page.locator("#canvas-droppable")
        # We assume canvas starts empty or with placeholder.
        # If item added, we expect a div with class that looks like a component wrapper

        print("Verification Complete.")
        browser.close()

if __name__ == "__main__":
    run()
