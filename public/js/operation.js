// Bootstrap Carousel
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".carousel").forEach(carouselEl => {
    const carousel = new bootstrap.Carousel(carouselEl, {
      interval: 3000,   // 3 seconds
      pause: "hover",
      wrap: true,
      ride: "carousel" 
    });

    // Optional but extra safe
    carousel.cycle();
  });
});


// Toggle edit/disable for a blog card
const originalData = {};

function toggleEdit(id) 
{
  const title = document.getElementById(`title-${id}`);
  const content = document.getElementById(`content-${id}`);
  const btn = document.getElementById(`editBtn-${id}`);

  const isEditing = title.getAttribute("contenteditable") === "true";

  if (!isEditing) 
    {
      // enable editing
      originalData[id] = {
        title: title.innerText,
        content: content.innerText
      };

      title.setAttribute("contenteditable", "true");
      content.setAttribute("contenteditable", "true");
      title.focus();

      btn.classList.replace("btn-outline-primary", "btn-outline-secondary");
    } 
  else 
    {
      // disable editing
      title.innerText = originalData[id].title;
      content.innerText = originalData[id].content;

      title.setAttribute("contenteditable", "false");
      content.setAttribute("contenteditable", "false");

      btn.classList.replace("btn-outline-secondary", "btn-outline-primary");
    }
}

// Prepare form inputs before submitting update
function prepareUpdate(id) 
{
  document.getElementById(`titleInput-${id}`).value =
    document.getElementById(`title-${id}`).innerText.trim();

  document.getElementById(`contentInput-${id}`).value =
    document.getElementById(`content-${id}`).innerText.trim();
}

