{
  let view = {
    el: '.search-container',
    init(){
      this.$el = $(this.el)
    },
    template: `
      <div class="input-container">
        <i class="fas fa-search searchIcon"></i>
        <input type="search" name="search" class="input" autocomplete="off" placeholder="搜索歌曲">
        <div class="timesContainer">
          <i class="fas fa-times-circle timesIcon"></i>
        </div>
      </div>
    `,
    render(){
      this.$el.html(this.template)
    },
    hide(){
      this.$el.parent().removeClass('active')
    },
    show(){
      this.$el.parent().addClass('active')
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.model = model
      this.view = view
      this.view.init()
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){
      this.view.$el.find('.input').on('focus',(e)=>{
        e.preventDefault()
        this.view.$el.find('.input-container').addClass('active')
        // let value = $(e.currentTarget).val()
        // console.log(value)
      })
      this.view.$el.find('.input').on('blur',(e)=>{
        e.preventDefault()
        this.view.$el.find('.input-container').removeClass('active')
        // let value = $(e.currentTarget).val()
        // window.eventHub.emit('search',value)
      })
      this.view.$el.find('.input').on('input',(e)=>{
        let value = $(e.currentTarget).val()
        if(value){
          this.view.$el.find('.timesContainer').addClass('active')
        }else{
          this.view.$el.find('.timesContainer').removeClass('active')
          window.eventHub.emit('noSearchValue')
        }
      })
      this.view.$el.find('.timesContainer').on('click',(e)=>{
        this.view.$el.find('.input').val('')
        this.view.$el.find('.input').trigger('focus')
        $(e.currentTarget).removeClass('active')
        window.eventHub.emit('resetSearch')
      })
      this.view.$el.on('submit',(e)=>{
        e.preventDefault()
        this.view.$el.find('.input').trigger('blur')
        let value = this.view.$el.find('.input').val()
        window.eventHub.emit('search',value)
      })
      
    },
    bindEventHub(){
      window.eventHub.on('selectTab',(tabName)=>{
        if(tabName === 'page-search'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
      window.eventHub.on('selectSearchTab',(value)=>{
        this.view.$el.find('.input').val(value)
        // $el.find('.input').trigger('focus')
        this.view.$el.find('.timesContainer').addClass('active')
      })
    },
    fistLetterUpper(string){
      return string.charAt(0).toUpperCase()+string.slice(1);
    }
  }

  controller.init(view,model)
}