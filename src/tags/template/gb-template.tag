<gb-template>
  <div if={ isActive }>
    <yield>
      <div each={ zone in zones } class="gb-zone-{ zone.name }">
        <gb-content-zone if={ zone.type === 'Content' }></gb-content-zone>
        <gb-rich-content-zone if={ zone.type === 'Rich_Content' }></gb-rich-content-zone>
        <gb-record-zone if={ zone.type === 'Record' }></gb-record-zone>
      </div>
    </yield>
  </div>

  <script>
    import './gb-content-zone.tag';
    import './gb-rich-content-zone.tag';
    import './gb-record-zone.tag';
    import { Template } from './gb-template';
    this.mixin(new Template().__proto__);
  </script>
</gb-template>
