const textarea = document.querySelector("textarea");
if (textarea) {
  textarea.addEventListener("keydown", (e) => {
    if (e.key == "Tab") {
      e.preventDefault();

      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + "\t" + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 1;

    }
  })
}

const editBtn = document.querySelector("#editBtn");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const lesson = document.querySelector("#lesson");
const form = document.querySelector("form");
// console.log(editBtn.dataset.id)
if (editBtn) {
  editBtn.addEventListener("click", () => {
    fetch(editBtn.dataset.url)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        title.value = data.title;
        description.value = data.description;
        lesson.value = data.lesson;
        form.action = `/${data._id}?_method=PUT`;
      })
    });
}
