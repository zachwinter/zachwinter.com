<template>
  <Section title="Contact" description=" ">
    <H2
      >tell<br />
      me<br />
      your<br />
      secrets</H2
    >
    <nav data-v-dfd679c0="">
      <a data-v-dfd679c0="" href="mailto:contact@zachwinter.com" target="email"
        ><svg
          data-v-dfd679c0=""
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-mail-icon lucide-mail"
        >
          <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
          <rect x="2" y="4" width="20" height="16" rx="2"></rect></svg></a
      ><a data-v-dfd679c0="" href="tel:+18508428313" target="phone"
        ><svg
          data-v-dfd679c0=""
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-smartphone-icon lucide-smartphone"
        >
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
          <path d="M12 18h.01"></path></svg></a
      ><a data-v-dfd679c0="" href="http://github.com/zachwinter" target="github"
        ><svg
          data-v-dfd679c0=""
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-github-icon lucide-github"
        >
          <path
            d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
          ></path>
          <path d="M9 18c-4.51 2-5-2-7-2"></path></svg></a
      ><a data-v-dfd679c0="" href="https://www.instagram.com/zachary.io" target="instagram"
        ><svg
          data-v-dfd679c0=""
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-instagram-icon lucide-instagram"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg
      ></a>
    </nav>
  </Section>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Doto:wght,ROND@100,0..100&family=League+Script&display=swap');

nav {
  @include flex-row;
  @include box;
}

h2 {
  font-family: 'League Script';
  width: 100%;
  text-align: center;
  font-weight: 400;
  padding: 1rem;

  @include mobile {
    font-size: 3rem;
    line-height: 1;
  }
}

br {
  display: none;

  @include mobile {
    display: block;
  }
}

a {
  text-decoration: none;
  transform: none;
  color: $purple;
  transition: var(--hover-transition);

  &:hover {
    color: var(--pink) !important;
  }

  &:active {
    transform: scale(0.9);
  }

  svg {
    @include size(3rem);
    stroke-width: 0.5;
  }
}

@include mobile {
  nav {
    @include flex-row(center, start);
    flex-wrap: wrap;
  }
}
</style>
