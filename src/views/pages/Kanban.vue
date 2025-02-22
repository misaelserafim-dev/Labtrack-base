<template>
  <div class="p-4">
    <div class="flex gap-4">
      <div v-for="(tasksList, column) in tasks" 
           :key="column" 
           class="card-kanban w-full max-w-xs bg-white p-3 rounded-lg shadow-md flex-shrink-0"
           @dragover.prevent
           @drop="onDropTask(column, 0)">

        <div class="flex justify-between items-center mb-4">
          <h3 :class="columnClass(column)" class="font-semibold text-lg text-white">{{ columnTitle(column) }}</h3>
          <button @click="addTask(column)" class="px-4 py-2 rounded flex items-center">
            <i class="pi pi-plus mr-2"></i> Nova Tarefa
          </button>
        </div>

        <div v-if="tasksList.length === 0" class="empty-dropzone p-4 border-dashed border-2 border-gray-300 rounded-lg text-center text-gray-500" @dragover.prevent @drop="onDropTask(column, 0)">
          Arraste uma tarefa aqui
        </div>

        <div v-for="(task, index) in tasksList"
            :key="task.title"
            class="p-4 border mb-2 rounded-lg cursor-pointer bg-[#f8fbfd]"
            draggable="true"
            @dragstart="onDragStart(task, column, index)"
            @dragover.prevent
            @dragenter="onDragEnter(column, index)"
            @drop="onDropTask(column, index)"
            @click="openTaskModal(task)">

          <div class="flex flex-col">
            <span class="text-md font-bold mb-2">{{ task.title }}</span>
            <div class="flex items-center text-sm text-gray-500 mt-1 ml-3">
              <i class="pi pi-calendar mr-2"></i>
              <span>{{ task.date }}</span>
            </div>
            <div class="mt-2 flex items-center ml-3">
              <i class="pi pi-flag mr-2"></i>
              <span :class="priorityClass(task.priority)" class="text-xs font-semibold">{{ task.priority }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

   <!-- modal abrir ratefas -->
    <div v-if="selectedTask" class="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div class="modal-content bg-white w-full max-w-3xl rounded-lg relative">
        <span class="close absolute top-2 right-2 text-2xl cursor-pointer" @click="closeTaskModal">&times;</span>
        <div class="modal-body flex flex-col md:flex-row">

          <div class="relative task-info w-full md:w-1/2 p-6">
            <div class="absolute right-2 top-4 flex justify-end p-2">
              <i class="pi pi-ellipsis-v cursor-pointer text-xl" @click="toggleMenu"></i>
               
              <div v-if="menuOpen" class="absolute right-2 top-10 bg-white shadow-md rounded-md w-40 z-50">
                <ul class="py-2">
                  <li class="px-4 py-2 cursor-pointer hover:bg-gray-200" @click="deleteTask"><i class="pi pi-trash"></i> Excluir Tarefa</li>
                </ul>
              </div>
            </div>

            <h2 class="font-bold text-2xl mb-4">
              <input type="text" v-model="selectedTask.title" class="rounded w-full" />
            </h2>

            <div class="itens-task-information">
              <p><strong><i class="pi pi-calendar mr-2"></i> Data:</strong>
                <input type="date" :value="formatDate" @input="updateDate($event.target.value)" class="border p-2 rounded text-sm">
              </p>
              <p><strong><i class="pi pi-flag mr-2"></i> Prioridade:</strong>
                <select v-model="selectedTask.priority" class="border p-2 rounded text-sm">
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </p>
              <p class="mt-4"><strong><i class="pi pi-file mr-2"></i> Descrição:</strong></p>
            </div>

            <div class="mb-4">
              <textarea v-model="selectedTask.description" class="description-task border p-2 rounded w-full h-40" placeholder="Descrição da tarefa..."></textarea>
            </div>

            <div class="mb-4">
              <h3 class="font-bold mb-2">Anexos</h3>
              <div class="image-container mt-2">
                <label for="upload_files">
                  <i class="pi pi-upload mr-2"></i>
                  <input id="upload_files" type="file" accept="image/*" @change="FileUploadAnexo" class="mt-2">
                </label>
                <div v-if="selectedTask.images.length" class="previes-upload-itens flex flex-wrap gap-2">
                  <img
                    v-for="(img, index) in selectedTask.images"
                    :key="index"
                    :src="img"
                    class="uploaded-image w-20 h-20 object-cover rounded-md cursor-pointer transition-transform"
                    @click="expandedImage = img">
                </div>
              </div>
            </div>
          </div>

          <!-- box Comentários -->
          <div class="card-right w-full md:w-1/2 p-6 border-l mt-4 md:mt-0">
            <div class="scroll-modal-item">
              <h3 class="font-bold mb-2">Comentários</h3>
              <div class="comments-section">
                <ul>  
                  <li v-for="(comment, index) in selectedTask.comments" :key="index" class="comment flex items-start gap-2 p-2">
                    <img :src="comment.avatar" class="w-8 h-8 rounded-full">
                    <div class="frame-comment flex items-start gap-2">

                        <div class="hover-comments">
                          <i class="pi pi-ellipsis-v cursor-pointer text-xl" @click="toggleMenuComments(index)"></i>
                          <div v-if="menuOpenComments === index" class="menu-item-comments absolute right-4 top-2 bg-white shadow-md rounded-md w-40 z-50">
                            <i class="pi pi-trash cursor-pointer text-red-500" @click="selectedTask.comments.splice(index, 1)"></i>
                            <i class="pi pi-pencil cursor-pointer text-blue-500" @click="editComment(index)"></i>
                          </div>
                        </div>
                        
                        <div>
                          <div class="flex justify-between w-full pb-2">
                            <p class="font-bold mr-4">{{ comment.user }}</p>
                            <span class="text-gray-500 text-sm">{{ comment.timestamp }}</span>
                          </div>

                          <div v-if="comment.fileUrl">
                            <div v-if="comment.fileUrl.includes('image')" class="img-comments-item">
                              <img :src="comment.fileUrl" class="rounded-md cursor-pointer transition-transform" @click="expandedImage = comment.fileUrl">
                            </div>
                            <div v-else>
                              <a :href="comment.fileUrl" target="_blank" class="text-blue-500">Abrir Arquivo</a>
                            </div>
                          </div>
                          <p v-else>{{ comment.text }}</p>
                        </div>
                       
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- adicionar comentários -->
            <div class="edit-comments mt-4 flex gap-2">
              <label for="upload_files_comments">
                  <i class="pi pi-upload mr-2"></i>
                  <input id="upload_files_comments" type="file" accept="image/*" class="mt-2" @change="AddFileUploadComment">
                </label>
              <textarea v-model="newComment" placeholder="Adicione um comentário..." class="comment-box flex-1 p-2 border rounded-md"></textarea>
              <button @click="addComment" class="comment-submit bg-blue-500 text-white px-4 py-2 rounded-md">Enviar</button>
            </div>

          </div>
        </div>
      </div>
    </div>

  <!-- fim da modal -->

  <!-- Modal para ampliar imagens -->
  <div v-if="expandedImage" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75" style="z-index:1050" @click="expandedImage = null">
    <div class="relative">
      <img :src="expandedImage" class="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg">
      <button class="absolute top-2 right-2  text-2xl" @click.stop="expandedImage = null">&times;</button>
    </div>
  </div>

  </div>
</template>


<script>
export default {
  data() {
    return {
      tasks: {
        para_fazer: [{ title: "Criar layout", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent felis felis, gravida eget dolor tempor, luctus pulvinar sapien. Donec fermentum imperdiet eros quis cursus. Vivamus viverra ornare orci a sodales. In ultrices ligula in tortor sagittis, non mattis diam tincidunt. Nam sed blandit sapien. Etiam sed facilisis magna. Fusce dignissim est vel nibh tempus auctor. Praesent tortor purus, tincidunt nec quam quis, porta tincidunt nulla. Duis placerat augue sapien, id cursus ex pulvinar non. Donec mi sapien, dignissim sed semper sed, laoreet eget velit. Praesent mollis at neque vitae ultricies. Donec tempus ultricies fringilla. Phasellus euismod ac lorem vitae tristique. Vivamus faucibus rhoncus facilisis.", date: "20/02/2025", priority: "Alta", comments: [], images: [] }],
        andamento: [{ title: "Integrar API", description: "Conectar frontend ao backend", date: "05/03/2025", priority: "Média", comments: [], images: [] }],
        aprovacao: [{ title: "Revisar responsividade", description: "Testar para dispositivos móveis", date: "26/02/2025", priority: "Média", comments: [], images: [] }],
        validado: [],
        impedimento: [],
      },
      draggedTask: null,
      draggedFromColumn: null,
      draggedFromIndex: null,
      selectedTask: null,
      newComment: "",
      menuOpen: false,
      menuOpenComments: false,
      expandedImage: null,
    };
  },
  computed: {
    formatDate() 
    {
      if (!this.selectedTask || !this.selectedTask.date) return "";
      const parts = this.selectedTask.date.split("/");
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }, 
  methods: {
    addTask(column) 
    {
      const newTask = {
        title: "Nova Tarefa",
        description: "Descrição breve...",
        date: new Date().toLocaleDateString(),
        priority: "",
        comments: [], 
        images: []
      };
      this.tasks[column].push(newTask);
    },

    onDragStart(task, column, index) 
    {
      this.draggedTask = task;
      this.draggedFromColumn = column;
      this.draggedFromIndex = index;
    },

    onDragEnter(column, index) 
    {
      if (this.draggedFromColumn === column && this.draggedFromIndex !== index) {
        const list = this.tasks[column];
        const movingTask = list.splice(this.draggedFromIndex, 1)[0];
        list.splice(index, 0, movingTask);
        this.draggedFromIndex = index;
      }
    },

    onDropTask(column, index) 
    {
      if (!this.draggedTask) return;
        
      const taskCopy = { ...this.draggedTask }; // Garante reatividade

      if (this.draggedFromColumn !== column) {
        this.tasks[this.draggedFromColumn].splice(this.draggedFromIndex, 1);
        this.tasks[column].splice(index, 0, taskCopy);
      }

      this.draggedTask = null;
      this.draggedFromColumn = null;
      this.draggedFromIndex = null;
    },

    updateDate(newDate) 
    {
      if (this.selectedTask) 
      {
        const parts = newDate.split("-");
        this.$set(this.selectedTask, 'date', `${parts[2]}/${parts[1]}/${parts[0]}`);
      }
    },

    priorityClass(priority) 
    {
      switch (priority) {
        case 'Alta': return 'bg-red-300 text-red-700 px-2 py-1 rounded';
        case 'Média': return 'bg-yellow-200 text-yellow-700 px-2 py-1 rounded';
        case 'Baixa': return 'bg-green-200 text-green-700 px-2 py-1 rounded';
        default: return '';
      }
    },

    columnClass(column) 
    {
      return {
        para_fazer: 't-fazer',
        andamento: 't-andamento',
        aprovacao: 't-aprovacao',
        validado: 't-validado',
        impedimento: 't-impedimento'
      }[column];
    },

    columnTitle(column) 
    {
      return {
        para_fazer: "Para fazer",
        andamento: "Em andamento",
        aprovacao: "Em aprovação",
        validado: "Validado",
        impedimento: "Impedimento"
      }[column];
    },

    toggleMenu() 
    {
      this.menuOpen = !this.menuOpen;
    },

    deleteTask() 
    {
      if (confirm("Tem certeza que deseja excluir esta tarefa?")) 
      {
        this.selectedTask = null;
        this.menuOpen = false;
      }
    },
  
    openTaskModal(task) 
    {
      this.selectedTask = task;
    },

    closeTaskModal() 
    {
      this.selectedTask = null;
      this.newComment = "";
    },

    toggleMenuComments(index) 
    {
      if(this.menuOpenComments === index) {
        this.menuOpenComments = null;
      } else{
        this.menuOpenComments = index;
      }
    },

    FileUploadAnexo(event) 
    {
      const file = event.target.files[0];
      const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];

      if (file && allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedTask.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Formato de arquivo não suportado.");
      }
    },

    getFormatDate() 
    {
      const now = new Date();
      const commentDate = new Date();
      
      const hours = commentDate.getHours().toString().padStart(2, '0');
      const minutes = commentDate.getMinutes().toString().padStart(2, '0');
      
      const day = commentDate.getDate();
      const month = commentDate.getMonth();
      const year = commentDate.getFullYear();
      
      const nowDay = now.getDate();
      const nowMonth = now.getMonth();
      const nowYear = now.getFullYear();
      
      if (day === nowDay && month === nowMonth && year === nowYear) {
        return `Hoje às ${hours}:${minutes}`;
      } 
      else if (day === nowDay - 1 && month === nowMonth && year === nowYear) {
        return `Ontem às ${hours}:${minutes}`;
      } 
      else {
        const formatDate = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
        return `Em ${formatDate} às ${hours}:${minutes}`;
      }
    },

    addComment() 
    {
      if (this.newComment.trim() !== "") 
      {
        this.selectedTask.comments.push({
          user: "Misael Serafim",
          avatar: 'https://ui-avatars.com/api/?name=Mi',
          text: this.newComment,
          timestamp: this.getFormatDate(),
        });
        this.newComment = "";
      }
    },

    AddFileUploadComment(event) {
      const file = event.target.files[0];
      const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];

      if (file && allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
         
          const fileUrl = e.target.result;
          
          this.selectedTask.comments.push({
            user: "Misael Serafim",
            avatar: 'https://ui-avatars.com/api/?name=Mi',
            text: `Novo arquivo anexado: ${file.name}`,
            timestamp: this.getFormatDate(),
            fileUrl,
          });
          event.target.value = null;
        };
        reader.readAsDataURL(file); 
      } else {
        alert("Formato de arquivo não suportado.");
      }
    },
  }
};
</script>

<style scoped>
  .card-kanban h3 {
    padding: 0px 10px;
    border-radius: 4px;
  }
  .time-comment {
    width: 100px;
    text-align: right;
  }
  .t-fazer { background: purple; }
  .t-andamento { background: #48c775; }
  .t-aprovacao { background: #913408; }
  .t-validado { background: #12b5eb; }
  .t-impedimento { background: #f33b0f; }

  .empty-dropzone {
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .itens-task-information {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  /* Comentário melhorado */
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
  .description-task {
    border: 1px solid #e7e7e7;
    padding: 10px 20px;
    border-radius: 4px;
    line-height: 1.8;
    height: 300px;
    overflow: auto;
  }
  .modal-body .card-right{
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  /* Modal e elementos de comentário */
  .comment-submit:hover {
    background-color: #45a049;
  }
  input#upload_files,input#upload_files_comments {
    display: none;
  }
  .priority-dropdown {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
    /* Estilo da modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    z-index: 1000;
  }
  .itens-task-information strong {
    min-width: 120px;
    display: inline-block;
    padding-bottom: 5px;
  }
  .image-container {
    margin: 10px 0;
    min-height: 70px;    
    display: flex;
  }
  .image-container.mt-2 i.pi.pi-upload.mr-2 {
    background: #f1f0f0;
    padding: 28px;
    border-radius: 4px;
    font-size: 1rem;
    color: #7878;
    cursor: pointer;
  }
  .previes-upload-itens.flex.flex-wrap {
    gap: 10px;
  }
  .edit-comments i.pi.pi-upload.mr-2 {
    padding: 10px;
    cursor: pointer;
  }
  .menu-item-comments {
    width: 44px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  .menu-item-comments i {
    font-size: 12px;
  }
  .comments-section li.comment .frame-comment {
    background: #fff;
    padding: 10px 12px;
    border: 1px solid #e7e7e7;
    border-radius: 5px;
    position: relative;
    padding-right: 30px;
  }
  .hover-comments {
    position: absolute;
    right: 4px;
    top: 5px;
    color: #afaeae;
  }
  .edit-comments {
    align-items: center;
    position: relative;
  }
  .modal-content {
    position: relative;
    background: white;
    border-radius: 8px;
    width: 95%;
    max-width: 1280px;
    margin-top: 32px;
  }
  .scroll-modal-item {
    height: 100%;
  }
  .comments-section {
    height: calc(100% - 30px);
    overflow: auto;
    background: #fbfbfb;
    max-height: 597px;
    border-radius: 4px;
    padding: 10px;
    border: 1px solid #e7e7e7;
  }
  .close {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 30px;
    cursor: pointer;
  }

  @media screen and (max-width: 680px) {
    .image-container {
      height: auto;
    }
    .comments-section {
      height: auto;
      min-height: 150px;
      max-height: 500px;
  }
  }
</style>