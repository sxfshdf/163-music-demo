{
  let view = {
    el: '.page-hotSong',
    template: `
      <div class="banner">
        <img src="./img/hotSong-banner.jpg" alt="">
      </div>
      <div class="songList-container">
        <ul class="songList">
        </ul>
      </div>
      <div class="tip"> 已经到最后一首啦 </div>
    `,
    render(data){
      $(this.el).html(this.template)
      let {songs} = data
      let n = 0
      songs.map((song)=>{
        n+=1
        let $li = $(`
          <li class="song">
            <p class="order">${(n<10)?'0'+n:n}</p>
            <a href="./song.html?id=${song.id}">
              <div class="songInfo">
                <p class="songName">${song.name}</p>
                <p class="singer">${song.singer}</p>
              </div>
              <div class="playIcon">
                <i class="fas fa-play play"></i>
              </div>
            </a>
          </li>
        `)
        $(this.el).find('ul.songList').append($li)
      })
    },
    show(){
      $(this.el).addClass('active')
    },
    hide(){
      $(this.el).removeClass('active')
    }
  }

  let model = {
    data:{
      songs:[]
    },
    find() {
      let query = new AV.Query('Song')
      query.descending('updatedAt')
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          return Object.assign({id: song.id}, song.attributes)
        })
        return songs
      })
    }
  }

  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('selectTab',(tabName)=>{
        if(tabName === 'page-hotSong'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    }
  }

  controller.init(view,model)
}