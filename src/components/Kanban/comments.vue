<template>
  <div class="comments-section">
    <h3 class="font-bold mb-2">Comentários</h3>
    <ul>
      <li v-for="(comment, index) in comments" :key="index" class="comment flex items-start gap-2 p-2">
        <img :src="comment.avatar" class="w-8 h-8 rounded-full">
        <div class="frame-comment flex items-start gap-2">
          <div>
            <p class="font-bold">{{ comment.user }}</p>
            <p>{{ comment.text }}</p>
          </div>
          <p class="text-xs text-gray-500 time-comment">{{ comment.timestamp }}</p>
        </div>
      </li>
    </ul>

    <div class="edit-comments mt-4 flex gap-2">
      <label for="upload_files">
        <i class="pi pi-upload mr-2"></i>
        <input id="upload_files" type="file" accept="image/*" @change="handleFileUpload" class="mt-2 hidden">
      </label>
      <textarea v-model="newComment" placeholder="Adicione um comentário..." class="comment-box flex-1 p-2 border rounded-md"></textarea>
      <button @click="addComment" class="comment-submit bg-blue-500 text-white px-4 py-2 rounded-md">Enviar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comments: Array,
    task: Object
  },
  data() {
    return {
      newComment: ""
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.task.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    addComment() {
      if (this.newComment.trim() !== "") {
        this.task.comments.push({
          user: "Misael Serafim",
          avatar: 'https://ui-avatars.com/api/?name=Mi',
          text: this.newComment,
          timestamp: new Date().toLocaleString(),
        });
        this.newComment = "";
      }
    }
  }
};
</script>

<style scoped>
.comment-box {
    position: relative;
    width: 100%;
    height: 47px;
    padding: 8px 14px;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    padding-right: 80px;
    resize: none;
    margin-bottom: 0;
    margin-top: auto;
}
.comment-submit {
    margin-top: 10px;
    background-color: #4CAF50;
    color: white;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    position: absolute;
    bottom: 5px;
    right: 5px;
}
.comment-submit:hover {
  background-color: #45a049;
}
.time-comment {
  width: 100px;
  text-align: right;
}
</style>
