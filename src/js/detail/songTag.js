{
  let view = {
    el: '.description',
    template: `
      <div class="tag">
        <ul>
          <li>欧美</li>
          <li>音乐</li>
          <li>电音</li>
          <li>史诗级</li>
        </ul>
      </div>
    `,
    render(){
      $(this.el).html(this.template)
    }
  }

  let controller = {
    init(view){
      this.view = view
      this.view.render()
    }
  }

  controller.init(view)
}