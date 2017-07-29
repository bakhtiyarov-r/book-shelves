'use strict';

var bookshelfApp = angular.module("bookshelfApp", []);

bookshelfApp.controller("bookshelfController", ['$scope', 'orderByFilter', function($scope, orderBy) {
	var books = [

	    { title: "Воскресение",
	     authorInit: "Л. Н.",
	     authorName: "Лев",
	     authorSurname: "Толстой",
	     content: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.',
	     cover: "green"
	    },
	    { title: "Женщины",
	     authorInit: "Ч.",
	     authorName: "Чарльз",
	     authorSurname: "Буковски",
	     content: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.',
	     cover: "red"
	    },	    
	    { title: "Анна Каренина",
	     authorInit: "Л. Н.",
	     authorName: "Лев",
	     authorSurname: "Толстой",
	     content: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.',
	     cover: "blue"
	    },
	    { title: "На лестнице",
	     authorInit: "А.",
	     authorName: "Артур",
	     authorSurname: "Моррисон",
	     content: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.',
	     cover: "green"
	    },
	    { title: "Мастер и Маргарита",
	     authorInit: "М.",
	     authorName: "Михаил",
	     authorSurname: "Булгаков",
	     content: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.',
	     cover: "brown"
	    },
	    { title: "Последний дюйм",
	     authorInit: "Д.",
	     authorName: "Джеймс",
	     authorSurname: "Олдридж",
	     content: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.',
	     cover: "green"
	    },
	    { title: "Война и мир",
	     authorInit: "Л. Н.",
	     authorName: "Лев",
	     authorSurname: "Толстой",
	     content: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.',
	     cover: "red"
	    }
	];

	$scope.random = function(){
      return Math.random() - 0.5; 
    };
    $scope.propertyName = $scope.random;
    $scope.books = orderBy(books, $scope.propertyName);

    $scope.sortBy = function(propertyName) {      
      $scope.propertyName = propertyName;
      $scope.books = orderBy(books, $scope.propertyName);
    };

    
    
}]);


// Перемещение
////////////////

document.onmousedown = function(e) {  
	// Клик не левой кнопкой мышы или на полосу прокрутки
if (e.which != 1 || typeof(e.target.closest) !== 'function') return;


  var elem = e.target.closest('.book-item');   

  if (!elem) return; // Клик вне переносимого объекта

  var bookItemCover = elem.children[0],
      bookItemFace = elem.children[1],
      coords = getCoords(elem),
      shiftX = e.pageX - coords.left, // Смещение координат левого верхнего угла относительно курсора
      shiftY = e.pageY - coords.top,
      downX = e.pageX,  // Координаты начала движения
      downY = e.pageY;  


  function moveAt(e) {
    elem.style.left = e.pageX - shiftX + 'px';
    elem.style.top = e.pageY - shiftY + 'px';
  };

  document.onmousemove = function(e) {
  	e.preventDefault();
  	var moveX = e.pageX - downX;
    var moveY = e.pageY - downY;
    if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
      return; // Ничего не делать, если мышь передвинулась недостаточно далеко
    }
  	elem.style.position = 'absolute';
    elem.style.zIndex = '9999';
    bookItemCover.style.transform = null;
    bookItemFace.style.transform = null;
    elem.querySelector('.book-item__rotate').style.display = null;
    document.body.appendChild(elem);          
    moveAt(e);    
  };

  document.onmouseup = function(e) {
  	if (elem) {
      finishDrag(e);      
    }    
    elem = null;
  };

  function finishDrag(e) {
    var dropElem = findDroppable(e);
    var siblingElem = findSibling(e);
    if (siblingElem) {
      dropElem.insertBefore(elem, siblingElem);      
      elem.style.position = null;
      elem.style.left = null;
      elem.style.top = null;
      elem.style.zIndex = null;      
      document.onmousemove = null;
      document.onmouseup = null;
    } else {
      elem.querySelector('.book-item__rotate').style.display = 'block';
      document.onmousemove = null;
      document.onmouseup = null;
    }
  };

  function findSibling(event) {
  	 elem.hidden = true;
    // получаем элемент, рядом с которым будет размещен переносимый элемент
    var siblingElem = document.elementFromPoint(event.clientX, event.clientY);
    elem.hidden = false;
    if (siblingElem == null) { // если курсор мыши вышел за границу окна
      return null;
    }    
    return siblingElem.closest('.book-item');

  };

  function findDroppable(event) {
    elem.hidden = true;
    // получаем элемент под курсором мыши
    var dropElem = document.elementFromPoint(event.clientX, event.clientY);
    elem.hidden = false;
    if (dropElem == null) { // если курсор мыши вышел за границу окна
      return null;
    }

    return dropElem.closest('.books');
  }


  elem.ondragstart = function() {
    return false;  // отключаем D'n'D браузера
  };

};

function getCoords(elem) { 
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset - 30,  // margin-top: 30 px
    left: box.left + pageXOffset
  };

};

/////////////
// Вращение 
/////////////

document.addEventListener('mousedown', start);

function start(e) {

  if(e.which != 1 || typeof(e.target.closest) !== 'function') return;

  var angle = 0,
    angleFace = 90,
    rotation = 0,
    startAngle = 0,
    center = {
      x: 0,
      y: 0
    },
    R2D = 180 / Math.PI,
    elem = e.target.closest('.book-item__rotate');

    if (!elem) return;

  var bookItem = elem.parentElement,
      bookItemCover = bookItem.children[0],
      bookItemFace = bookItem.children[1],

      coords = elem.getBoundingClientRect(),
      t = coords.top,
      l = coords.left,
      h = coords.height,
      w = coords.width,
      x, y;

  var center = {  
    x: l + (w / 2),
    y: t + (h / 2)
  };

  x = e.pageX - center.x;  // Центр вращения
  y = e.pageY - center.y;
  startAngle = R2D * Math.atan2(y, x);

  document.onmousemove = function(e) {
    e.preventDefault();	  // предотваращаем выделение объектов при перемещении курсора
    rotate(e);
  };

  function rotate(e) {
    var x = e.pageX - center.x,
    y = e.pageY - center.y,
    d = R2D * Math.atan2(y, x);
    rotation = Math.abs(d) - startAngle;
    bookItemCover.style.transform = "rotateY(" + (angle - Math.abs(rotation)) + "deg)";
    bookItemFace.style.transform = "rotateY(" + (angleFace - Math.abs(rotation)) + "deg)";
  };

  function stop(e) {
  	document.onmousemove = null;
    document.onmouseup = null; 	
  };

  document.onmouseup = function(e) {
  	if (elem) {
  	  stop(e);      
    }      
  };

};

document.addEventListener("click", function(e) {   // Клик на обложку книги
   var elem = e.target.closest('.book-item__face'); 
   if (!elem) return; 
   var wrapper = document.querySelector('.wrapper');
   showCover();
   wrapper.classList.add('wrapper_open');       // Открываем подложку и вставляем в нее контент из книги
   var bookContent = elem.nextElementSibling;
   wrapper.appendChild(bookContent);            
   wrapper.lastElementChild.classList.add('book-item__content_open');

   var wrapperClose = wrapper.querySelector('.wrapper__close');
   
   wrapperClose.onclick = function() {         // Закрываем подложку возвращаем контент обратно в книгу
   	hideCover();
   	wrapper.lastElementChild.classList.remove('book-item__content_open');
   	wrapper.classList.remove('wrapper_open');
   	elem.parentElement.insertBefore(bookContent, elem.nextElementSibling);

   }
   

});

// полупрозрачный DIV, затеняющий всю страницу
    function showCover() {
      var coverDiv = document.createElement('div');
      coverDiv.className = 'cover';
      document.body.appendChild(coverDiv);
    }

    function hideCover() {
      document.body.removeChild(document.querySelector('.cover'));
    } 


