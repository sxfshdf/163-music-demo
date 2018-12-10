{
  let view = {
    el:'.bg',
    template: `
      <div class="background">
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