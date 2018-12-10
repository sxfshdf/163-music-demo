{
  let view = {
    el: '.searchResult',
    init(){
      $el = $(this.el)
    },
    template: `
      <p class="result">匹配结果:</p>
      <ul class="songList">
      </ul>
    `,
    render(data){
      $el.siblings('.searchResult').html(this.template)
      let {songs} = data
      songs.map((song)=>{
        let $li = $(`<li class="song">
        <a href="">
          <div class="songInfo">
            <p class="songName">${song.name}</p>
            <p class="singer">${song.singer}</p>
          </div>
          <div class="playIcon">
            <i class="fas fa-play play"></i>
          </div>
        </a>
        </li>`)
        
        $el.siblings('.searchResult').find('ul.songList').append($li)
      })
    },
    hide(){
      $el.siblings('.searchResult').removeClass('active')
    },
    show(){
      // $el form.search-container
      $el.siblings('.searchResult').addClass('active')
    }
  }

  let model = {
    data:{
      songs:[]
    },
    search(data){
      let query = new AV.Query('Song')
      // let {searchFilter} = data
      query.contains('name', data)
      return query.find().then((songs)=>{
        this.data.songs = songs.map((song) => {
        let songs = { id: song.id, ...song.attributes }
          return songs
        })
        return songs
      })
    }
  }

  let controller = {
    init(view,model){
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){
      $el.on('click','li',(e)=>{
        e.preventDefault()
        console.log(e.currentTarget)
      })
    },
    bindEventHub(){
      window.eventHub.on('search',(value)=>{
        this.view.show()

        // let valueFilter = {
        //   searchFilter: [
        //     $el.find('.input').val(),
        //     value.toUpperCase(),
        //     value.toLowerCase(),
        //     this.fistLetterUpper(value),
        //     value.trim().replace(/\s/g,""),
        //     this.fistLetterUpper(value.trim().replace(/\s/g,""))
        //   ]
        // }
        // console.log(valueFilter)
        this.model.search(value).then(()=>{
          this.view.render(this.model.data)
        })
      })
      window.eventHub.on('resetSearch',()=>{
        this.view.hide()
      })
      window.eventHub.on('noSearchValue',()=>{
        this.view.hide()
      })
      window.eventHub.on('selectSearchTab',(value)=>{
        this.view.show()
        this.model.search(value).then(()=>{
          this.view.render(this.model.data)
        })
      })
    }
  }

  controller.init(view,model)
}