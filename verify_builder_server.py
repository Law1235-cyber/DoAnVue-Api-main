from playwright.sync_api import sync_playwright
import time
import os

def run():
    print("Starting verification on local server...")
    url = "http://localhost:3000"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print(f"Navigating to {url}")
        try:
            page.goto(url, timeout=10000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            return

        print("Verifying Header...")
        page.wait_for_selector("text=Site Builder", timeout=5000)

        print("Verifying Sidebar Nav...")
        commerce_btn = page.locator("button:has-text('Commerce')")
        commerce_btn.wait_for(state="visible")

        print("Opening Sidebar Drawer...")
        commerce_btn.click()
        time.sleep(1)

        # We need to be specific because "Hero Product" might appear in thumbnail map and label
        # The new styling adds "Hero Product" in a span
        hero_product = page.locator("span:text-is('Hero Product')").first
        if hero_product.is_visible():
            print("Drawer opened, Hero Product found.")
        else:
            print("Drawer failed to open or content missing.")

        print("Verifying Mobile Layout...")
        page.set_viewport_size({"width": 375, "height": 812})
        time.sleep(1)

        box = commerce_btn.bounding_box()
        # Bottom nav should be visible at bottom
        if box['y'] > 700:
            print(f"Mobile Nav is at bottom (y={box['y']}).")
        else:
            print(f"Mobile Nav position incorrect (y={box['y']}).")

        # Re-click to toggle/ensure open on mobile
        # Depending on state, it might be closed or open.
        # If it was open on desktop, switching to mobile:
        # React state `activeCategory` persists.
        # So drawer should be `translate-y-0` (visible).

        time.sleep(1)
        if hero_product.is_visible():
             print("Mobile Drawer content visible.")
        else:
             print("Mobile Drawer content hidden (might need re-trigger).")
             commerce_btn.click()
             time.sleep(1)
             if hero_product.is_visible():
                  print("Mobile Drawer opened after click.")

        browser.close()

if __name__ == "__main__":
    run()
