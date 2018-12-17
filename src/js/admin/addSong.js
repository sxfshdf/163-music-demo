{
  let view = {
    el: '.addSong',
    template: `
    <div class="selectorWrapper">
      <p>选择要给歌单添加的歌曲</p>
      <div class="selectors">
      <div>
        <input data-songId="11111" type="checkbox" id="天后" name="song" value="天后" checked>
        <label for="song">hahaha</label>
      </div>

      <div>
       <input data-songId="22222" type="checkbox" id="到不了" value="到不了" name="song">
       <label for="song">hohohoho</label>
      </div>
      </div>
      <form class="actions">
        <button type="button" class="add">添加</button>
        <button type="button" class="cancel">取消</button>
      </form>
    </div>
    `,
    render(data){
      // let html = this.template
      // html = html.replace('{{name}}',data.playlist.name)
      $(this.el).html(this.template)
      let { songs } = data
      let doms = songs.map((song)=>{
        return `
        <div>
          <input data-songId="${song.id}" type="checkbox" id="${song.name}" name="song" value="${song.name}">
          <label for="${song.name}">${song.name}</label>
        </div>
        `
      })
      $(this.el).find('.selectors').empty()
      doms.map((dom)=>{
        $(this.el).find('.selectors').append(dom)
      })
    },
    show() {
      $(this.el).css('display', 'block')
    },
    hide() {
      $(this.el).css('display', 'none')
    }
  }

  let model = {
    data: {
      songs: [],
    },
    find() {
      let query = new AV.Query('Song')
      query.descending('updatedAt')
      // query.ascending('createdAt')
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          let songs = { id: song.id, ...song.attributes }
          let createDate = song.createdAt.toLocaleDateString()
          let createHours = time(song.createdAt.getHours())
          let createMinutes = time(song.createdAt.getMinutes())
          let createSeconds = time(song.createdAt.getSeconds())

          let updateDate = song.updatedAt.toLocaleDateString()
          let updateHours = time(song.updatedAt.getHours())
          let updateMinutes = time(song.updatedAt.getMinutes())
          let updateSeconds = time(song.updatedAt.getSeconds())
          function time(time) {
            if (time < 10) {
              time = '0' + time
            }
            return time
          }
          let createTime = createDate + ' ' + createHours + ':' + createMinutes + ':' + createSeconds
          let updateTime = updateDate + ' ' + updateHours + ':' + updateMinutes + ':' + updateSeconds
          songs.createTime = createTime
          songs.updateTime = updateTime
          return songs
        })
        return songs
      })
    },
    addSong(song){
      // let playlist = this.model.data.playlist
      let playlist = AV.Object.createWithoutData('Playlist', this.data.playlist.id);
      let newsong = AV.Object.createWithoutData('Song',song.id)
      // newsong.set('name',song.name)
      // newsong.set('cover',song.cover)
      // newsong.set('url',song.url)
      // newsong.set('singer',song.singer)
      // newsong.set('lyric',song.lyric)
      let playlisttMap = new AV.Object('PlaylistMap')
      playlisttMap.set('song', newsong)
      playlisttMap.set('playlist', playlist)

      // newsong.set('dependent', playlist);
      playlisttMap.save()
    }
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.model.find().then(()=>{
        console.log('--------')
        console.log(this.model.data)
        this.view.render(this.model.data)
      })
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {
      $(this.view.el).on('click', '.add', (e) => {
        e.preventDefault()
        let songArray = []
        let songs = this.model.data.songs
        $('input[name="song"]:checked').each(function (xxx) {
          let song
          let songId = $(this).attr('data-songId')
          for(let i=0; i<songs.length; i++){
            if(songs[i].id === songId){
              song = songs[i]
            }
          }
          songArray.push(song)
        })
        // console.log(songArray)
        songArray.map((song)=>{
          this.model.addSong(song)
        })
        window.eventHub.emit('addSongDone',this.model.data.playlist)
      })
      $(this.view.el).on('click','.cancel',()=>{
        window.eventHub.emit('addSongCancel')
      })
    },
    bindEventHub() {
      window.eventHub.on('upload', () => {
        this.view.hide()
      })
      window.eventHub.on('addSongs', (data) => {
        let {playlist} = data 
        this.model.data.playlist = playlist
        this.view.show()
      })
      window.eventHub.on('addSongDone',()=>{
        this.view.hide()
        $('input[name="song"]').prop('checked',false)
      })
      window.eventHub.on('addSongCancel',()=>{
        this.view.hide()
        $('input[name="song"]').prop('checked',false)
      })
    }
  }

  controller.init(view, model)
}