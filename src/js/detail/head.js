{
  let view = {
    el: '.head',
    init(){
      this.$el = $(this.el)
    },
    template: `
      <div class="image-container">
      <div class="mount">
        <span class="fas fa-headphones headphone"></span>
        <span class="number">100.5万</span>
      </div>
      <div class="image">
      </div>
      </div>
      <div class="songInfo">
        <p class="name">史诗级万评电音评电音评电音</p>
        <div class="creator">
          <div class="creatorImg">
          </div>
          <p class="creatorName">柠檬没有枝条</p>
        </div>
      </div>
    `,
    render(data){
      this.$el.html(this.template)
      // $el.find('.image').css('background-image',data.image)
      // $el.find('name').text(data.name)
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){},
    bindEventHub(){
      window.eventHub.on('selectList',(data)=>{
        console.log(1)
        this.view.render(data)
      })
    }
  }

  controller.init(view,model)
}