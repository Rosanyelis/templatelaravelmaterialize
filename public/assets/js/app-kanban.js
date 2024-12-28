/**
 * App Kanban
 */

'use strict';

(async function () {
    let boards;
    const kanbanSidebar = document.querySelector('.kanban-update-item-sidebar'),
        kanbanWrapper = document.querySelector('.kanban-wrapper'),
        commentEditor = document.querySelector('.comment-editor'),
        kanbanAddNewBoard = document.querySelector('.kanban-add-new-board'),
        kanbanAddNewInput = [].slice.call(document.querySelectorAll('.kanban-add-board-input')),
        kanbanAddBoardBtn = document.querySelector('.kanban-add-board-btn'),
        datePicker = document.querySelector('#due-date'),
        select2 = $('.select2'), // ! Using jquery vars due to select2 jQuery dependency
        assetsPath = document.querySelector('html').getAttribute('data-base-url');

    // Init kanban Offcanvas
    const kanbanOffcanvas = new bootstrap.Offcanvas(kanbanSidebar);

    // Get kanban data
    const kanbanResponse = await fetch(assetsPath + '/kamban-json');
    if (!kanbanResponse.ok) {
        console.error('error', kanbanResponse);
    }
    boards = await kanbanResponse.json();

    // datepicker init
    if (datePicker) {
        datePicker.flatpickr({
            monthSelectorType: 'static',
            altInput: true,
            altFormat: 'j F, Y',
            dateFormat: 'Y-m-d'
        });
    }

    //! TODO: Update Event label and guest code to JS once select removes jQuery dependency
    // select2
    if (select2.length) {
        function renderLabels(option) {
            if (!option.id) {
                return option.text;
            }
            var $badge = "<div class='badge " + $(option.element).data('color') + " rounded-pill'> " + option.text + '</div>';
            return $badge;
        }

        select2.each(function () {
            var $this = $(this);
            select2Focus($this);
            $this.wrap("<div class='position-relative'></div>").select2({
                placeholder: 'Select Label',
                dropdownParent: $this.parent(),
                templateResult: renderLabels,
                templateSelection: renderLabels,
                escapeMarkup: function (es) {
                    return es;
                }
            });
        });
    }

    // Comment editor
    if (commentEditor) {
        new Quill(commentEditor, {
            modules: {
                toolbar: '.comment-toolbar'
            },
            placeholder: 'Write a Comment... ',
            theme: 'snow'
        });
    }

    // Render board dropdown
    //   function renderBoardDropdown() {
    //     return (
    //       "<div class='dropdown'>" +
    //       "<i class='dropdown-toggle ri-more-2-line ri-20px cursor-pointer' id='board-dropdown' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></i>" +
    //       "<div class='dropdown-menu dropdown-menu-end' aria-labelledby='board-dropdown'>" +
    //       "<a class='dropdown-item delete-board' href='javascript:void(0)'> <i class='ri-delete-bin-7-line'></i> <span class='align-middle'>Eliminar</span></a>" +
    //       "<a class='dropdown-item' href='javascript:void(0)'><i class='ri-edit-2-fill'></i> <span class='align-middle'>Renombrar</span></a>" +
    //       "<a class='dropdown-item' href='javascript:void(0)'><i class='ri-archive-line'></i> <span class='align-middle'>Archivar</span></a>" +
    //       '</div>' +
    //       '</div>'
    //     );
    //   }
    // Render item dropdown
    function renderDropdown() {
        return (
            "<div class='dropdown kanban-tasks-item-dropdown'>" +
            "<i class='dropdown-toggle ri-more-2-line' id='kanban-tasks-item-dropdown' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></i>" +
            "<div class='dropdown-menu dropdown-menu-end' aria-labelledby='kanban-tasks-item-dropdown'>" +
            "<a class='dropdown-item' href='javascript:void(0)'>Copy task link</a>" +
            "<a class='dropdown-item' href='javascript:void(0)'>Duplicate task</a>" +
            "<a class='dropdown-item delete-task' href='javascript:void(0)'>Delete</a>" +
            '</div>' +
            '</div>'
        );
    }
    // Render header
    function renderHeader(color, text) {
        return (
            "<div class='d-flex justify-content-between flex-wrap align-items-center mb-2'>" +
            "<div class='item-badges d-flex'> " +
            "<div class='badge rounded-pill bg-label-" +
            color +
            "'> " +
            text +
            '</div>' +
            '</div>' +
            renderDropdown() +
            '</div>'
        );
    }

    // Render avatar
    function renderAvatar(images, pullUp, size, margin, user) {
        var $transition = pullUp ? ' pull-up' : '',
            $size = size ? 'avatar-' + size + '' : '',
            member = user ? user : '';

        return images == undefined
            ? ' '
            : images
                .split(',')
                .map(function (img, index, arr) {
                    var $margin = margin && index !== arr.length - 1 ? ' me-' + margin + '' : '';

                    return (
                        "<div class='avatar " +
                        $size +
                        $margin +
                        "'" +
                        "data-bs-toggle='tooltip' data-bs-placement='top'" +
                        "title='" +
                        member +
                        "'" +
                        '>' +
                        "<img src='" +
                        assetsPath +
                        img +
                        "' alt='Avatar' class='rounded-circle " +
                        $transition +
                        "'>" +
                        '</div>'
                    );
                })
                .join(' ');
    }

    // Render footer
    function renderFooter( assigned, members) {
        return (
            "<div class='d-flex justify-content-between align-items-center flex-wrap mt-2'>" +
            "<div> </div>"+
            "<div class='avatar-group d-flex align-items-center assigned-avatar'>" +
            renderAvatar(assigned, true, 'xs', null, members) +
            '</div>' +
            '</div>'
        );
    }
    // Init kanban
    const kanban = new jKanban({
        element: '.kanban-wrapper',
        gutter: '12px',
        widthBoard: '250px',
        dragItems: true,
        boards: boards,
        dragBoards: true,
        addItemButton: true,
        buttonContent: '+ Agregar Cliente',
        itemAddOptions: {
            enabled: true, // añadir un botón al tablero para facilitar la creación de artículos
            content: '+ Nuevo Cliente', // texto o contenido html del botón del tablón
            class: 'kanban-title-button btn btn-default btn-md shadow-none text-capitalize fw-normal text-heading', // default class of the button
            footer: false // position the button on footer
        },
        click: function (el) {
            console.log(el);

            let element = el;
            let title = element.getAttribute('data-eid') ? element.querySelector('.kanban-text').textContent : element.textContent,
                projectTitle = element.getAttribute('data-project_title'),
                budget = element.getAttribute('data-budget'),
                phone = element.getAttribute('data-phone'),
                email = element.getAttribute('data-email'),
                date = element.getAttribute('data-due-date'),

                dateObj = new Date(element.getAttribute('data-created_at')),
                year = dateObj.getFullYear(),
                dateToUse = date ? date + ', ' + year : dateObj.getDate() + ' ' + dateObj.toLocaleString('es', { month: 'long' }) + ', ' + year,
                label = element.getAttribute('data-badge-text'),
                avatars = element.getAttribute('data-assigned');


            // Show kanban offcanvas
            kanbanOffcanvas.show();

            // To get data on sidebar
            kanbanSidebar.querySelector('#title').value = title;
            kanbanSidebar.querySelector('#due-date').nextSibling.value = dateToUse;
            kanbanSidebar.querySelector('#project-title').value = projectTitle;
            kanbanSidebar.querySelector('#budget').value = budget;
            kanbanSidebar.querySelector('#phone').value = phone;
            kanbanSidebar.querySelector('#email').value = email;

            // ! Using jQuery method to get sidebar due to select2 dependency
            $('.kanban-update-item-sidebar').find(select2).val(label).trigger('change');

            // Remove & Update assigned
            kanbanSidebar.querySelector('.assigned').innerHTML = '';
            kanbanSidebar
                .querySelector('.assigned')
                .insertAdjacentHTML(
                    'afterbegin',
                    renderAvatar(avatars, false, 'sm', '2', el.getAttribute('data-user'))
                );
        },


        buttonClick: function (el, boardId) {
            // Crear el formulario dinámico
            const addNew = document.createElement('form');
            addNew.setAttribute('class', 'new-item-form');
            addNew.innerHTML = `
                <div class="mb-4">
                    <textarea class="form-control add-new-item" rows="2" placeholder="Nombre de Cliente" autofocus required></textarea>
                </div>
                <div class="mb-4">
                    <button type="submit" class="btn btn-primary btn-sm me-4">Agregar</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm cancel-add-item">Cancelar</button>
                </div>`;

            // Agregar el formulario al tablero
            kanban.addForm(boardId, addNew);

            // Manejo del evento de "submit"
            addNew.addEventListener('submit', function (e) {
                e.preventDefault();

                const taskTitle = e.target[0].value.trim(); // Obtener el título
                if (!taskTitle) {
                    alert('El título no puede estar vacío.');
                    return;
                }

                // Agregar tarea al tablero
                const taskId = Date.now(); // Generar un ID único temporal
                kanban.addElement(boardId, {
                    title: `<span class='kanban-text'>${taskTitle}</span>`,
                    id: taskId
                });

                // Enviar la nueva tarea al servidor
                fetch('/kamban/store-task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify({
                        board_id: boardId,
                        client: taskTitle
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log('Cliente guardado:', data.task);
                        } else {
                            alert('Hubo un problema al guardar la tarea en el servidor.');
                        }
                    }).catch(error => {
                        console.error(error);
                        error.response?.text().then(text => {
                            console.error('Respuesta del servidor no válida:', text);
                        });
                    });

                // Eliminar el formulario
                addNew.remove();
            });

            // Manejo del botón de "Cancelar"
            addNew.querySelector('.cancel-add-item').addEventListener('click', function () {
                addNew.remove();
            });
        }

    });

    // Kanban Wrapper scrollbar
    if (kanbanWrapper) {
        new PerfectScrollbar(kanbanWrapper);
    }

    const kanbanContainer = document.querySelector('.kanban-container'),
        kanbanTitleBoard = [].slice.call(document.querySelectorAll('.kanban-title-board')),
        kanbanItem = [].slice.call(document.querySelectorAll('.kanban-item'));

    // Render custom items
    if (kanbanItem) {
        kanbanItem.forEach(function (el) {
          const element = "<span class='kanban-text'>" + el.textContent + '</span>';
          let img = '';
          if (el.getAttribute('data-image') !== null) {
            img =
              "<img class='img-fluid mb-2 rounded-4' src='" +
              assetsPath +
              'img/elements/' +
              el.getAttribute('data-image') +
              "'>";
          }
          el.textContent = '';
          if (el.getAttribute('data-badge') !== undefined && el.getAttribute('data-badge-text') !== undefined) {
            el.insertAdjacentHTML(
              'afterbegin',
              renderHeader(el.getAttribute('data-badge'), el.getAttribute('data-badge-text')) + img + element
            );
          }
          if (
            el.getAttribute('data-comments') !== undefined ||
            el.getAttribute('data-due-date') !== undefined ||
            el.getAttribute('data-assigned') !== undefined
          ) {
            el.insertAdjacentHTML(
              'beforeend',
              renderFooter(

                el.getAttribute('data-assigned'),
                el.getAttribute('data-members')
              )
            );
          }
        });
      }

    // To initialize tooltips for rendered items
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // prevent sidebar to open onclick dropdown buttons of tasks
    const tasksItemDropdown = [].slice.call(document.querySelectorAll('.kanban-tasks-item-dropdown'));
    if (tasksItemDropdown) {
        tasksItemDropdown.forEach(function (e) {
            e.addEventListener('click', function (el) {
                el.stopPropagation();
            });
        });
    }

    // Borrar tarea para tableros renderizados
    const deleteTask = [].slice.call(document.querySelectorAll('.delete-task'));
    if (deleteTask) {
        deleteTask.forEach(function (e) {
            e.addEventListener('click', function () {
                const id = this.closest('.kanban-item').getAttribute('data-eid');
                kanban.removeElement(id);
            });
        });
    }

    // Cancelar btn añadir nueva entrada
    const cancelAddNew = document.querySelector('.kanban-add-board-cancel-btn');
    if (cancelAddNew) {
        cancelAddNew.addEventListener('click', function () {
            kanbanAddNewInput.forEach(el => {
                el.classList.toggle('d-none');
            });
        });
    }



    // Borrar editor de comentarios al cerrar
    kanbanSidebar.addEventListener('hidden.bs.offcanvas', function () {
        kanbanSidebar.querySelector('.ql-editor').firstElementChild.innerHTML = '';
    });

    // Re-init tooltip when offcanvas opens(Bootstrap bug)
    if (kanbanSidebar) {
        kanbanSidebar.addEventListener('shown.bs.offcanvas', function () {
            const tooltipTriggerList = [].slice.call(kanbanSidebar.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        });
    }
})();
