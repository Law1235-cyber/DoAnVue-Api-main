<template>
  <footer>
    <div class="join">
      join our adiclub & get 15% off
    </div>

    <div class="contact">
      <div>
        <h1>PRODUCT</h1>
        <p>Shoes <br>Clothing <br>Accessories <br>Gift Cards <br><br><br>New Arrivals <br>Best Sellers <br>Release Date <br>Sale</p>
      </div>

      <div>
        <h1>COLLECTION</h1>
        <p>adicolor <br>Ultraboost <br>Forum <br>Superstar <br>Running shoes <br>adilette <br>Stan Mith <br>adizero <br>Tiro <br>Cloudfoam Pure</p>
      </div>

      <div>
        <h1>SUPPORT</h1>
        <p>Help <br>Returns & Exchanges <br>Shipping <br>Order Tracker <br>Store Locator <br>Size Chart <br>Gift Card Balance <br>How to Clean Shoes <br>Bra Fit Guide</p>
      </div>

      <div>
        <h1>FOLLOW US</h1>
        <i class="fa-brands fa-facebook"></i> <br>
        <i class="fa-brands fa-square-instagram"></i> <br>
        <i class="fa-brands fa-square-x-twitter"></i> <br>
        <i class="fa-brands fa-pinterest"></i> <br>
        <i class="fa-brands fa-tiktok"></i> <br>
        <i class="fa-brands fa-youtube"></i>
      </div>
    </div>

    <div class="footer">
      <p>Your Privacy Choices - Privacy Policy - Terms and Conditions</p>
      <p>&copy; 2025 adidas America, Inc</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
};
</script>

<style scoped>
.contact{
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 3 cột bằng nhau */
    gap: 20px; /* Khoảng cách giữa các cột */
    margin: 40px;
    justify-items: center;
}
.contact div{
    line-height: 2;
}
.contact div h1{
    font-weight: bold;
}
.footer{
    text-align: center;
    background: black;
    color: white;
    line-height: 2;
}
.join{
    text-transform: uppercase;
    font-weight: bold;
    background: yellow;
    color: black;
    text-align: center;
    height: 10vh;
    font-size: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>