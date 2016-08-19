<gb-carousel>
  <a class="gb-carousel__previous-link" onclick={ prev }>Prev</a>
  <gb-list items={ options } activation={ isSelected }>
    <yield/>
  </gb-list>
  <a class="gb-carousel__next-link" onclick={ next }>Next</a>

  <script>
    import '../list/gb-list.tag';
    import { Carousel } from './gb-carousel';
    this.mixin(new Carousel().__proto__);
  </script>

  <style scoped>
    gb-list > ul > li:not(.active) {
      display: none;
    }
  </style>
</gb-carousel>
