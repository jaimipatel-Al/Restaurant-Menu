<script setup>
  import { useAuthStore } from "@/stores/authStore";
  import { useRouter } from "vue-router";
  import swal from "@/plugin/sweetalert";

  const authStore = useAuthStore();
  const router = useRouter();

  const exploreRestaurant = () => {
    if (authStore?.userData?.userId) router.push("/restaurant");
    else {
      swal
        .fire({
          title: "No Access Granted",
          text: "First You Should Sig Up Or Login To System.",
          icon: "warning",
          showCancelButton: false,
        })
        .then((result) => {
          if (result.isConfirmed) router.push("/signup");
        });
    }
  };
</script>

<template>
  <div>
    <section
      class="w-full m-auto flex-between flex-col sm:flex-row sm:space-x-4 md:space-x-8 lg:space-x-10 bg-gray-200">
      <div class="p-4 md:p-8 lg:p-10">
        <h1 class="home-page-title text-4xl md:text-6xl lg:text-7xl">
          Discover the World of <span class="text-orange-700">Flavors</span>!
        </h1>
        <p class="home-page-details">
          Your ultimate destination for discovering mouthwatering recipes, hidden food
          gems, and culinary inspiration from around the world. Whether you're a foodie,
          home cook, or just love great flavors, we bring you the best dishes, guides, and
          tips to satisfy your cravings. Let's explore more together!
        </p>
        <button class="button" @click="exploreRestaurant()">Explore Food</button>
      </div>
      <img src="@/assets/img/dal-rice.jpg" alt="Dal Rice" class="w-80 md:w-96 lg:w-auto h-auto sm:h-100" />
    </section>
    <section
      class="w-full m-auto flex-between flex-col sm:flex-row sm:space-x-4 md:space-x-8 lg:space-x-10 pa-10 my-10">
      <img src="@/assets/img/about-us.svg" alt="About Us" class="w-40 sm:w-96" />
      <div class="p-4 md:p-8 lg:p-10">
        <h2 class="home-page-title">About Us</h2>
        <p class="home-page-details">
          Teamwork is working together of people to achieve a certain goal. Teamwork is
          the basic need for an organization to function. Furthermore, every organization
          has a division of several teams to perform specific tasks. Without teamwork
          nothing is possible. So, we are doing team work over 2years and giving more
          facilities in our Hamburger Shop.
        </p>
        <button class="button" @click="exploreRestaurant()">Contact Us</button>
      </div>
    </section>
    <section class="text-center bg-gray-100 p-4 md:p-8 lg:p-10">
      <h1 class="home-page-title">Our <span class="text-orange-700">Recipies</span></h1>
      <p class="home-page-details">
        Simply sharing a table or insights about one another's food culture helps unmask
        our common humanity. The universal language of food is a unifying force
      </p>
      <div class="flex-between flex-col md:flex-row w-full my-4 md:my-8 lg:my-10 px-4 md:px-8 lg:px-10">
        <div class="home-food-box">
          <img src="@/assets/img/noodles.png" alt="Noodles"
            class="rounded-xl rounded-b h-48 sm:h-52 md:h-80 w-full sm:w-80 md:w-full" />
          <div>
            <h2 class="home-page-semi-title my-1 sm:my-4">Noodles</h2>
            <p class="home-page-details px-1 sm:px-5 text-center sm:text-start md:text-center">
              Boil noodles and drain. Sauté garlic, onions, and veggies in oil. Add soy
              sauce, chili sauce, and vinegar. Toss in the noodles, mix well, and stir-fry
              for a few minutes. Garnish with spring onions and serve hot!
            </p>
          </div>
        </div>
        <div class="home-food-box">
          <img src="@/assets/img/jalebi.jpg" alt="Jalebi"
            class="rounded-xl rounded-b h-48 sm:h-52 md:h-80 w-full sm:w-80 md:w-full" />
          <div>
            <h2 class="home-page-semi-title my-1 sm:my-4">Jalebi</h2>
            <p class="home-page-details px-1 sm:px-5 text-center sm:text-start md:text-center">
              Make a batter with flour, yogurt, and water. Ferment for 6-8 hours. Pipe
              spirals into hot oil and fry until crispy. Soak in sugar syrup flavored with
              saffron and cardamom. Serve warm and enjoy!
            </p>
          </div>
        </div>
        <div class="home-food-box">
          <img src="@/assets/img/dahi-puri.jpg" alt="Dahi Puri"
            class="rounded-xl rounded-b h-48 sm:h-52 md:h-80 w-full sm:w-80 md:w-full" />
          <div>
            <h2 class="home-page-semi-title my-1 sm:my-4">Dahi Puri</h2>
            <p class="home-page-details px-1 sm:px-5 text-center sm:text-start md:text-center">
              Fill crispy puris with boiled potatoes and sprouts. Add sweet tamarind and
              spicy green chutney, chilled yogurt. Sprinkle with chaat masala, sev, and
              fresh coriander. Serve immediately for a crunchy, tangy delight!
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="text-center px-5 py-10">
      <h1 class="home-page-title">
        Your Food <span class="text-orange-700">Delivery Partner</span>
      </h1>
      <p class="home-page-details">
        Fast Deliver is a fast growing and promising courier and parcel service in
        Bangladesh. With excellent customer service.
      </p>
      <div class="flex-between w-full my-4 md:my-8 lg:my-10">
        <div class="delivery-box">
          <img src="@/assets/img/easy-order.svg" alt="Easy To Order" style="height: 85%" />
          <h2 class="home-page-semi-title">Easy To Order</h2>
        </div>
        <div class="delivery-box">
          <img src="@/assets/img/fastest-delivery.svg" alt="Fastest Delivery" style="height: 85%" />
          <h2 class="home-page-semi-title">Fastest Delivery</h2>
        </div>
        <div class="delivery-box">
          <img src="@/assets/img/best-quality.svg" alt="Best Quality" style="height: 85%" />
          <h2 class="home-page-semi-title">Best Quality</h2>
        </div>
      </div>
    </section>
  </div>
</template>
