{
  let view = {
    el: '.content',
    template: `
    <div class="logoArea">
      <img src="./img/music.svg" alt="" class="logo">
      <p>Upload your songs .</p>
    </div>
      <div class="uploadArea">
        <div id="uploadContainer" class="uploadContainer">
          <span id="plus" class="fas fa-plus plus"></span>
        </div>
        <p class="description">点击选区或者拖曳歌曲至选区添加歌曲</p>
      </div>
    </div>
    `,
    find(selector){
      return $(this.el).find(selector)[0]
    },
    render(data) {
      $(this.el).html(this.template)
    }
  }

  let model = {}

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.initQiniu()
    },
    initQiniu() {
      var uploader = Qiniu.uploader({
        runtimes: 'html5',    //上传模式,依次退化
        browse_button: this.view.find('#plus'),       //上传选择的点选按钮，**必需**
        uptoken_url: 'http://localhost:8888/uptoken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        domain: 'pj7wrbm0i.bkt.clouddn.com',   //bucket 域名，下载资源时用到，**必需**
        get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
        container: this.view.find('#uploadContainer'),           //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '40mb',           //最大文件体积限制
        dragdrop: true,                   //开启可拖曳上传
        drop_element: this.view.find('#uploadContainer'),        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
          'FilesAdded': function (up, files) {
            plupload.each(files, function (file) {
              // 文件添加进队列后,处理相关的事情
            });
          },
          'BeforeUpload': function (up, file) {
            // 每个文件上传前,处理相关的事情
            window.eventHub.emit('beforeUploaded')
            
          },
          'UploadProgress': function (up, file) {
            // 每个文件上传时,处理相关的事情
          },
          'FileUploaded': function (up, file, info) {
            // 每个文件上传成功后,处理相关的事情
            // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

            var domain = up.getOption('domain')
            var response = JSON.parse(info.response);
            var sourceLink = 'http://' + domain + '/' + encodeURIComponent(response.key)
            window.eventHub.emit('upload',{
              url: sourceLink, // 外链
              name: response.key //歌名
            })
            window.eventHub.emit('afterUploaded')
          },
          'Error': function (up, err, errTip) {
            //上传出错时,处理相关的事情
          },
          'UploadComplete': function () {
            
            //队列文件处理完毕后,处理相关的事情
          },
          // 'Key': function (up, file) {
          //   // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
          //   // 该配置必须要在 unique_names: false , save_key: false 时才生效

          //   var key = "";
          //   // do something with key here
          //   return key
          // }
        }
      })
    }
  }
  controller.init(view, model)
}