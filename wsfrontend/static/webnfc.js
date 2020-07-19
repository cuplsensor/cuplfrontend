class WebNFCView {
  constructor(controller) {
    this.controller = controller;

    this.writebutton = document.getElementById('writebutton');
    this.writebutton.addEventListener('click', controller);

    this.controller.model.subscribe(this);
  }

  update(updatedmodel) {
    if (updatedmodel.writepending) {
      this.writebutton.classList.add("is-loading");
    } else {
      this.writebutton.classList.remove("is-loading");
    }

     if (updatedmodel.enabled) {
      this.writebutton.removeAttribute('disabled');
      }
      else {
        this.writebutton.setAttribute('disabled', true);
      }

  }
}