<gb-select-button>
  <yield>
    <span class="gb-button__label">{ _scope.selectLabel() }</span>
    <img src={ _scope.iconUrl } alt="" />
  </yield>

  <script>
    this.root.addEventListener('focus', this._scope.prepFocus);
    this.root.addEventListener('click', this._scope.unFocus);
  </script>

  <style scoped>
    img {
      margin-left: 10px;
      margin-top: 2px;
      height: 24px;
    }
  </style>
</gb-select-button>
