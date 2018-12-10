{
  let view = {
    el: '.search-container',
    init(){
      $el = $(this.el)
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
      $el.html(this.template)
    },
    hide(){
      $el.parent().removeClass('active')
    },
    show(){
      $el.parent().addClass('active')
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
      $el.find('.input').on('focus',(e)=>{
        e.preventDefault()
        $el.find('.input-container').addClass('active')
        // let value = $(e.currentTarget).val()
        // console.log(value)
      })
      $el.find('.input').on('blur',(e)=>{
        e.preventDefault()
        $el.find('.input-container').removeClass('active')
        // let value = $(e.currentTarget).val()
        // window.eventHub.emit('search',value)
      })
      $el.find('.input').on('input',(e)=>{
        let value = $(e.currentTarget).val()
        if(value){
          $el.find('.timesContainer').addClass('active')
        }else{
          $el.find('.timesContainer').removeClass('active')
          window.eventHub.emit('noSearchValue')
        }
      })
      $el.find('.timesContainer').on('click',(e)=>{
        $el.find('.input').val('')
        $el.find('.input').trigger('focus')
        $(e.currentTarget).removeClass('active')
        window.eventHub.emit('resetSearch')
      })
      $el.on('submit',(e)=>{
        e.preventDefault()
        $el.find('.input').trigger('blur')
        let value = $el.find('.input').val()
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
        $el.find('.input').val(value)
        // $el.find('.input').trigger('focus')
        $el.find('.timesContainer').addClass('active')
      })
    },
    fistLetterUpper(string){
      return string.charAt(0).toUpperCase()+string.slice(1);
    }
  }

  controller.init(view,model)
}