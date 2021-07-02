(()=>{"use strict";var __webpack_modules__={752:()=>{eval("\n\nconst STATUS_CODE_OK = 200;\nconst TIMEOUT_IN_MS = 10000;\n\nconst ServerUrl = {\n  GET: `https://21.javascript.pages.academy/keksobooking/data`,\n  POST: `https://21.javascript.pages.academy/keksobooking`,\n};\n\nconst onRequestLoad = (request, onLoad, onError) => {\n  if (request.status === STATUS_CODE_OK) {\n    onLoad(request.response);\n  } else {\n    onError(`Статус ответа: ${request.status} ${request.statusText}`);\n  }\n};\n\nconst onRequestError = (onError) => onError(`Произошла ошибка соединения`);\nconst onRequestTimeout = (onError) => onError(`Запрос не успел выполниться за ${TIMEOUT_IN_MS} мс`);\n\nconst sendRequest = (onSuccess, onError, requestMethod, data) => {\n  const request = new XMLHttpRequest();\n  request.responseType = `json`;\n  request.timeout = TIMEOUT_IN_MS;\n  request.addEventListener(`load`, () => onRequestLoad(request, onSuccess, onError));\n  request.addEventListener(`error`, () => onRequestError(onError));\n  request.addEventListener(`timeout`, () => onRequestTimeout(onError));\n  const url = requestMethod === `POST` ? ServerUrl.POST : ServerUrl.GET;\n  request.open(requestMethod, url);\n  if (data) {\n    request.send(data);\n  } else {\n    request.send();\n  }\n};\n\nconst get = (onSuccess, onError) => sendRequest(onSuccess, onError, `GET`);\nconst post = (data, onSuccess, onError) => sendRequest(onSuccess, onError, `POST`, data);\n\nwindow.backend = {\n  get,\n  post,\n};\n\n\n//# sourceURL=webpack://keksobooking/./js/modules/backend.js?")},600:()=>{eval("\n\nconst ApartmentNames = {\n  'palace': `Дворец`,\n  'flat': `Квартира`,\n  'house': `Дом`,\n  'bungalow': `Бунгало`\n};\n\nconst map = document.querySelector(`.map`);\nconst filterContainer = map.querySelector(`.map__filters-container`);\nconst cardTemplate = document.querySelector(`#card`).content;\n\nconst addFeatures = (newCard, advertisement) => {\n  const featureSection = newCard.querySelector(`.popup__features`);\n  featureSection.innerHTML = ``;\n  let features = advertisement.offer.features;\n  for (let i = 0; i < features.length; i++) {\n    const feature = document.createElement(`li`);\n    feature.classList.add(`popup__feature`);\n    feature.classList.add(`popup__feature--${features[i]}`);\n    featureSection.appendChild(feature);\n  }\n};\n\nconst addPhotos = (newCard, advertisement) => {\n  const photosSection = newCard.querySelector(`.popup__photos`);\n  photosSection.innerHTML = ``;\n  let photos = advertisement.offer.photos;\n  for (let i = 0; i < photos.length; i++) {\n    const photo = document.createElement(`img`);\n    photo.classList.add(`popup__photo`);\n    photo.src = `${photos[i]}`;\n    photo.alt = `Фотография жилья`;\n    photo.style.width = `45px`;\n    photo.style.height = `40px`;\n    photosSection.appendChild(photo);\n  }\n};\n\nconst create = (advertisement, id) => {\n  const newCard = cardTemplate.cloneNode(true);\n  newCard.querySelector(`.popup__title`).textContent = advertisement.offer.title;\n  newCard.querySelector(`.popup__text--address`).textContent = advertisement.offer.address;\n  newCard.querySelector(`.popup__text--price`).textContent = `${advertisement.offer.price}₽/ночь`;\n  newCard.querySelector(`.popup__type`).textContent = ApartmentNames[advertisement.offer.type];\n  newCard.querySelector(`.popup__text--capacity`).textContent = `${advertisement.offer.rooms} комнаты для ${advertisement.offer.guests} гостей`;\n  newCard.querySelector(`.popup__text--time`).textContent = `Заезд после ${advertisement.offer.checkin}, выезд до ${advertisement.offer.checkout}`;\n  addFeatures(newCard, advertisement);\n  newCard.querySelector(`.popup__description`).textContent = advertisement.offer.description;\n  addPhotos(newCard, advertisement);\n  newCard.querySelector(`.popup__avatar`).src = advertisement.author.avatar;\n  newCard.querySelector(`.map__card.popup`).dataset.id = id;\n  return newCard;\n};\n\nconst remove = () => {\n  const card = document.querySelector(`.map__card.popup`);\n  if (card) {\n    card.remove();\n  }\n};\n\nconst show = (pin, pinsArray) => {\n  const id = pin.data(`id`);\n  const fragment = document.createDocumentFragment();\n  const newCard = create(pinsArray[id], id);\n  fragment.appendChild(newCard);\n  map.insertBefore(fragment, filterContainer);\n};\n\nconst hide = () => {\n  const card = document.querySelector(`.map__card`);\n  card.remove();\n};\n\nconst onCloseButtonClick = (evt) => {\n  removeListener();\n  hide();\n  window.map.removeActivePin(evt);\n};\n\nconst onEscKeydown = (evt) => {\n  const isEscape = evt.key === `Escape`;\n  if (isEscape) {\n    evt.preventDefault();\n    removeListener();\n    hide();\n    window.map.removeActivePin(evt);\n  }\n};\n\nconst addListener = () => {\n  const closeButton = document.querySelector(`.popup__close`);\n  closeButton.addEventListener(`click`, onCloseButtonClick);\n  document.addEventListener(`keydown`, onEscKeydown);\n};\n\nconst removeListener = () => {\n  const closeButton = document.querySelector(`.popup__close`);\n  closeButton.removeEventListener(`click`, onCloseButtonClick);\n  document.removeEventListener(`keydown`, onEscKeydown);\n};\n\nconst expand = (pin, pins) => {\n  remove();\n  show(pin, pins);\n  addListener();\n};\n\nwindow.card = {\n  create,\n  expand,\n  remove,\n};\n\n\n\n//# sourceURL=webpack://keksobooking/./js/modules/card.js?")},695:()=>{eval("\n\nconst MIN_PRICE_VALUE = 10000;\nconst MAX_PRICE_VALUE = 50000;\nconst ANY_VALUE = `any`;\n\nconst PriceFiltering = {\n  MIDDLE: `middle`,\n  LOW: `low`,\n};\n\nconst QuantityOfRooms = {\n  ONE: `1`,\n  TWO: `2`,\n  THREE: `3`,\n};\n\nconst QuantityOfGuests = {\n  NULL: `0`,\n  ONE: `1`,\n  TWO: `2`,\n};\n\nconst filtersForm = $(`.map__filters`);\nconst housingType = filtersForm.find(`#housing-type`);\nconst housingPrice = filtersForm.find(`#housing-price`);\nconst housingRooms = filtersForm.find(`#housing-rooms`);\nconst housingGuests = filtersForm.find(`#housing-guests`);\nconst housingFeatures = filtersForm.find(`#housing-features`);\n\nconst checkPrice = (pins) => {\n  const priceValue = housingPrice.val();\n  if (priceValue !== ANY_VALUE) {\n    pins = pins.filter((e) => {\n      switch (priceValue) {\n        case PriceFiltering.MIDDLE:\n          return e.offer.price > MIN_PRICE_VALUE || e.offer.price < MAX_PRICE_VALUE;\n        case PriceFiltering.LOW:\n          return e.offer.price < MIN_PRICE_VALUE;\n        default:\n          return e.offer.price > MAX_PRICE_VALUE;\n      }\n    });\n  }\n  return pins;\n};\n\nconst checkPlace = (pins) => {\n  const typeValue = housingType.val();\n  if (typeValue !== ANY_VALUE) {\n    pins = pins.filter((e) => e.offer.type === typeValue);\n  }\n  return pins;\n};\n\nconst checkRooms = (pins) => {\n  const roomsValue = housingRooms.val();\n  if (roomsValue !== ANY_VALUE) {\n    pins = pins.filter((e) => {\n      switch (roomsValue) {\n        case QuantityOfRooms.ONE:\n          return e.offer.rooms === +QuantityOfRooms.ONE;\n        case QuantityOfRooms.TWO:\n          return e.offer.rooms === +QuantityOfRooms.TWO;\n        default:\n          return e.offer.rooms === +QuantityOfRooms.THREE;\n      }\n    });\n  }\n  return pins;\n};\n\nconst checkGuests = (pins) => {\n  const guestsValue = housingGuests.val();\n  if (guestsValue !== ANY_VALUE) {\n    pins = pins.filter((e) => {\n      switch (guestsValue) {\n        case QuantityOfGuests.ONE:\n          return e.offer.guests === +QuantityOfGuests.ONE;\n        case QuantityOfGuests.TWO:\n          return e.offer.guests === +QuantityOfGuests.TWO;\n        default:\n          return e.offer.guests === +QuantityOfGuests.NULL;\n      }\n    });\n  }\n  return pins;\n};\n\nconst checkCheckbox = (pins) => {\n  const checkedFeatures = housingFeatures.find(`.map__checkbox:checked`);\n  const features = Array.from(checkedFeatures).map((e) => e.value);\n  if (features.length > 0) {\n    pins = pins.filter((e) => features.every((checked) => e.offer.features.indexOf(checked) !== -1));\n  }\n  return pins;\n};\n\nconst getData = (pinsArray) => {\n  let filteredPins = [...pinsArray];\n  filteredPins = checkPrice(filteredPins);\n  filteredPins = checkPlace(filteredPins);\n  filteredPins = checkRooms(filteredPins);\n  filteredPins = checkGuests(filteredPins);\n  filteredPins = checkCheckbox(filteredPins);\n  return filteredPins;\n};\n\nconst onSectionChange = () => {\n  window.map.debounce();\n};\n\nconst addListeners = () => {\n  housingType.on(`change`, onSectionChange);\n  housingPrice.on(`change`, onSectionChange);\n  housingRooms.on(`change`, onSectionChange);\n  housingGuests.on(`change`, onSectionChange);\n  housingFeatures.on(`change`, onSectionChange);\n};\n\nwindow.filtersForm = {\n  getData,\n  addListeners,\n};\n\n\n\n//# sourceURL=webpack://keksobooking/./js/modules/filters-form.js?")},316:()=>{eval("\n\nconst MAX_QUANTITY_OF_ROOMS = 100;\nconst MIN_QUANTITY_OF_PLACES = 0;\n\nconst Message = {\n  NOT_ERROR: ``,\n  NOT_ENOUGH_ROOMS: `Каждая комната вмещает только 1 гостя, выберите более просторный вариант`,\n  TOO_MANY_ROOMS: `Для такого варианта доступно соответствие '100 комнат' и 'не для гостей'`,\n};\n\nconst MinPriceValue = {\n  BUNGALOW: 0,\n  FLAT: 1000,\n  HOUSE: 5000,\n  PALACE: 10000,\n};\n\nconst TypeApartment = {\n  BUNGALOW: `bungalow`,\n  FLAT: `flat`,\n  HOUSE: `house`,\n  PALACE: `palace`,\n};\n\nconst Time = {\n  TWELVE: `12:00`,\n  THIRTEEN: `13:00`,\n  FOURTEEN: `14:00`,\n};\n\nconst form = $(`.ad-form`);\nconst roomQuantity = form.find(`#room_number`);\nconst capacityQuantity = form.find(`#capacity`);\nconst type = form.find(`#type`);\nconst price = form.find(`#price`);\nconst timeIn = form.find(`#timein`);\nconst timeOut = form.find(`#timeout`);\n\nconst validationOfRoomsAndPlaces = (evt) => {\n  const rooms = +roomQuantity.val();\n  const places = +capacityQuantity.val();\n  let currentMessage = Message.NOT_ERROR;\n  if (rooms === MAX_QUANTITY_OF_ROOMS && places !== MIN_QUANTITY_OF_PLACES\n    || places === MIN_QUANTITY_OF_PLACES && rooms !== MAX_QUANTITY_OF_ROOMS) {\n    currentMessage = Message.TOO_MANY_ROOMS;\n  } else if (rooms < places) {\n    currentMessage = Message.NOT_ENOUGH_ROOMS;\n  }\n  if (currentMessage) {\n    evt.preventDefault();\n  }\n  roomQuantity[0].setCustomValidity(currentMessage);\n  roomQuantity[0].reportValidity();\n  return Boolean(!currentMessage);\n};\n\nconst onTypeChange = () => {\n  let minPrice = MinPriceValue.BUNGALOW;\n  switch (type.val()) {\n    case TypeApartment.FLAT:\n      minPrice = MinPriceValue.FLAT;\n      break;\n    case TypeApartment.HOUSE:\n      minPrice = MinPriceValue.HOUSE;\n      break;\n    case TypeApartment.PALACE:\n      minPrice = MinPriceValue.PALACE;\n      break;\n  }\n  price.attr(`min`, minPrice);\n  price.attr(`placeholder`, minPrice);\n};\n\nconst changeTimeValue = (firstSelectValue) => {\n  let time;\n  switch (firstSelectValue) {\n    case Time.TWELVE:\n      time = Time.TWELVE;\n      break;\n    case Time.THIRTEEN:\n      time = Time.THIRTEEN;\n      break;\n    case Time.FOURTEEN:\n      time = Time.FOURTEEN;\n      break;\n  }\n  return time;\n};\n\nconst onTimeInChange = () => {\n\n  timeOut.val(changeTimeValue(timeIn.val()));\n};\n\nconst onTimeOutChange = () => {\n  timeIn.val(changeTimeValue(timeOut.val()));\n};\n\nconst onFormSubmit = (evt) => {\n  if (validationOfRoomsAndPlaces(evt)) {\n    evt.preventDefault();\n    const formData = new FormData(form[0]);\n    window.backend.post(formData, window.utilForm.showSuccessModal, window.utilForm.showErrorModal);\n    window.map.deactivate();\n  }\n};\n\nconst addListener = () => {\n  roomQuantity.on(`change`, validationOfRoomsAndPlaces);\n  capacityQuantity.on(`change`, validationOfRoomsAndPlaces);\n  type.on(`change`, onTypeChange);\n  timeIn.on(`change`, onTimeInChange);\n  timeOut.on(`change`, onTimeOutChange);\n  form.on(`submit`, onFormSubmit);\n  window.preview.addListeners();\n};\n\nconst activate = () => {\n  addListener();\n};\n\nwindow.form = {\n  activate,\n};\n\n\n\n//# sourceURL=webpack://keksobooking/./js/modules/form.js?")},444:()=>{eval("\n\nconst onSuccess = window.map.activate;\nconst onError = window.util.showErrorMessage;\n\nwindow.backend.get(onSuccess, onError);\nwindow.form.activate();\n\n\n\n//# sourceURL=webpack://keksobooking/./js/modules/main.js?")},717:()=>{eval("\n\nconst RIGHT_BUTTON = 0;\nconst QUANTITY_SHOWN_PINS = 5;\nconst FILTER_SWITCHING_TIME = 500;\n\nconst $map = $(`.map`);\nconst $mainPin = $map.find(`.map__pin--main`);\nconst $pinsSection = $map.find(`.map__pins`);\nconst $form = $(`.ad-form`);\nconst $filtersForm = $(`.map__filters`);\nconst $formResetButton = $form.find(`.ad-form__reset`);\n\nlet pinsArray;\nlet lastTimeout;\n\nconst convertFieldsToDisabled = () => {\n  $(`.ad-form :input`).prop(`disabled`, true);\n  $(`.map__filters :input`).prop(`disabled`, true);\n};\n\nconst addId = () => {\n  for (let i = 0; i < pinsArray.length; i++) {\n    const pins = pinsArray[i];\n    pins.id = i;\n  }\n};\n\nconst convertPageToActive = () => {\n  $map.removeClass(`map--faded`);\n  $form.removeClass(`ad-form--disabled`);\n  $(`.ad-form :input`).prop(`disabled`, false);\n  $(`.map__filters :input`).prop(`disabled`, false);\n  $mainPin.off(`mousedown`, onMainPinMouseDown);\n};\n\nconst convertPageToDeactivate = () => {\n  $map.addClass(`map--faded`);\n  $form.addClass(`ad-form--disabled`);\n  $form[0].reset();\n  $filtersForm[0].reset();\n  $mainPin.on(`mousedown`, onMainPinMouseDown);\n};\n\nconst renderPins = (pins) => {\n  removeOldPins();\n  window.card.remove();\n  const fragment = $(document.createDocumentFragment());\n  const displayedPins = pins.length > QUANTITY_SHOWN_PINS ? QUANTITY_SHOWN_PINS : pins.length;\n  for (let i = 0; i < displayedPins; i++) {\n    const newPin = window.pin.create(pins[i]);\n    fragment.append(newPin);\n  }\n  $pinsSection.append(fragment);\n};\n\nconst debounce = () => {\n  if (lastTimeout) {\n    window.clearTimeout(lastTimeout);\n  }\n  lastTimeout = window.setTimeout(() => {\n    const filteredPins = window.filtersForm.getData(pinsArray);\n    renderPins(filteredPins);\n  }, FILTER_SWITCHING_TIME);\n};\n\nconst removeActivePin = () => {\n  const activePin = $(`.map__pin--active`);\n  if (activePin.length) {\n    activePin.removeClass(`map__pin--active`);\n  }\n};\n\nconst showActiveAdvertisement = (evt) => {\n  const pin = $(evt.target).closest(`.map__pin[type=button]:not(.map__overlay)`);\n  pin.addClass(`map__pin--active`);\n  window.card.expand(pin, pinsArray);\n};\n\nconst onPinSectionClick = (evt) => {\n  const $pin = $(evt.target).closest(`.map__pin:not(.map__pin--main)`);\n  const $card = $(`.map__card.popup`);\n  const cardAndPinPresent = ($card.length && $pin.length);\n  const isID = (cardAndPinPresent && $card.data(`id`) !== $pin.data(`id`));\n  const isCardDontOpen = ($pin.length && !$card.length);\n  if (isCardDontOpen || isID) {\n    removeActivePin();\n    showActiveAdvertisement(evt);\n  }\n};\n\nconst removeOldPins = () => {\n  const pins = $(`.map__pin:not(.map__pin--main)`);\n  if (pins) {\n    pins.remove();\n  }\n};\n\nconst addListenerOnPinSection = () => {\n  $pinsSection.on(`click`, onPinSectionClick);\n};\n\nconst activatePage = () => {\n  convertPageToActive();\n  window.pinMoving.setAddressValue();\n  renderPins(pinsArray);\n  addListenerOnPinSection();\n};\n\nconst onMainPinMouseDown = (evt) => {\n  if (typeof evt === `object`) {\n    switch (evt.button) {\n      case RIGHT_BUTTON:\n        activatePage();\n        break;\n    }\n  }\n};\n\nconst onEnterKeydown = (evt) => {\n  const isEnter = evt.key === `Enter`;\n  if (isEnter) {\n    evt.preventDefault();\n    activatePage();\n  }\n};\n\nconst onFormResetButtonClick = () => {\n  $form[0].reset();\n  $filtersForm.reset();\n  renderPins(pinsArray);\n  window.preview.reset();\n  window.pinMoving.resetPosition();\n};\n\nconst addListenerToActivatePage = () => {\n  $mainPin.on(`mousedown`, onMainPinMouseDown);\n  $mainPin.on(`keydown`, onEnterKeydown);\n  window.pinMoving.addListener();\n  window.filtersForm.addListeners();\n  $formResetButton.on(`click`, onFormResetButtonClick);\n};\n\nconst activate = (pins) => {\n  pinsArray = pins;\n  convertFieldsToDisabled();\n  addId();\n  addListenerToActivatePage();\n};\n\nconst deactivate = () => {\n  window.pinMoving.resetPosition();\n  convertPageToDeactivate();\n  removeOldPins();\n  window.card.remove();\n  window.preview.reset();\n};\n\nwindow.map = {\n  activate,\n  deactivate,\n  debounce,\n  renderPins,\n  removeActivePin,\n};\n\n\n//# sourceURL=webpack://keksobooking/./js/modules/map.js?")},788:()=>{eval("\n\nconst PIN_HEIGHT = 87;\nconst PIN_MIDDLE_WIDTH = 34;\nconst MAX_MAP_WIDTH = 1200;\nconst MIN_MAP_WIDTH = 270;\nconst MIN_MAP_HEIGHT = 130;\nconst MAX_MAP_HEIGHT = 630;\nconst RIGHT_BUTTON = 0;\n\nconst mainPin = document.querySelector(`.map__pin--main`);\nconst addressInput = document.querySelector(`#address`);\n\nlet currentCoordinateLeft = 570;\nlet currentCoordinateTop = 375;\nlet startCoordinates;\n\nconst checkCoordinate = () => {\n  currentCoordinateTop = currentCoordinateTop > MAX_MAP_HEIGHT ? MAX_MAP_HEIGHT : currentCoordinateTop;\n  currentCoordinateTop = currentCoordinateTop < MIN_MAP_HEIGHT ? MIN_MAP_HEIGHT : currentCoordinateTop;\n  currentCoordinateLeft = currentCoordinateLeft > (MAX_MAP_WIDTH - PIN_MIDDLE_WIDTH) ? (MAX_MAP_WIDTH - PIN_MIDDLE_WIDTH) : currentCoordinateLeft;\n  currentCoordinateLeft = currentCoordinateLeft < MIN_MAP_WIDTH ? MIN_MAP_WIDTH : currentCoordinateLeft;\n};\n\nconst setAddressValue = () => {\n  addressInput.value = `${currentCoordinateLeft + PIN_MIDDLE_WIDTH}, ${currentCoordinateTop + PIN_HEIGHT}`;\n};\n\nconst setPinPosition = () => {\n  mainPin.style.top = `${currentCoordinateTop}px`;\n  mainPin.style.left = `${currentCoordinateLeft}px`;\n};\n\nconst resetPosition = ()=> {\n  currentCoordinateLeft = 570;\n  currentCoordinateTop = 375;\n  setPinPosition();\n};\n\nconst setMoveValue = (evt) => {\n  let shift = {\n    x: startCoordinates.x - evt.clientX,\n    y: startCoordinates.y - evt.clientY\n  };\n  startCoordinates = {\n    x: evt.clientX,\n    y: evt.clientY\n  };\n  currentCoordinateLeft = mainPin.offsetLeft - shift.x;\n  currentCoordinateTop = mainPin.offsetTop - shift.y;\n};\n\nconst onMouseMove = (evt) => {\n  evt.preventDefault();\n  setMoveValue(evt);\n  checkCoordinate();\n  setPinPosition();\n  setAddressValue();\n};\n\nconst onMouseUp = (evt) => {\n  evt.preventDefault();\n  document.removeEventListener(`mousemove`, onMouseMove);\n  document.removeEventListener(`mouseup`, onMouseUp);\n};\n\nconst onMouseDown = (evt) => {\n  if (typeof evt === `object`) {\n    switch (evt.button) {\n      case RIGHT_BUTTON:\n        evt.preventDefault();\n        startCoordinates = {\n          x: evt.clientX,\n          y: evt.clientY\n        };\n        document.addEventListener(`mousemove`, onMouseMove);\n        document.addEventListener(`mouseup`, onMouseUp);\n        break;\n    }\n  }\n};\n\nconst addListener = () => {\n  mainPin.addEventListener(`mousedown`, onMouseDown);\n};\n\nwindow.pinMoving = {\n  setAddressValue,\n  addListener,\n  resetPosition,\n};\n\n\n//# sourceURL=webpack://keksobooking/./js/modules/pin-moving.js?")},286:()=>{eval("\n\nconst SHIFT_PIN_X = 40;\nconst SHIFT_PIN_Y = 51;\n\nconst pinTemplate = document.querySelector(`#pin`).content;\n\nconst create = (advertisement) => {\n  const newPin = pinTemplate.cloneNode(true);\n  newPin.querySelector(`.map__pin`).dataset.id = advertisement.id;\n  newPin.querySelector(`.map__pin`).style.left = `${advertisement.location.x + SHIFT_PIN_X}px`;\n  newPin.querySelector(`.map__pin`).style.top = `${advertisement.location.y + SHIFT_PIN_Y}px`;\n  newPin.querySelector(`img`).src = advertisement.author.avatar;\n  newPin.querySelector(`img`).alt = `Заголовок объявления`;\n  return newPin;\n};\n\nwindow.pin = {\n  create,\n};\n\n\n//# sourceURL=webpack://keksobooking/./js/modules/pin.js?")},391:()=>{eval("\n\nconst FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];\n\nconst fileChooserAvatar = document.querySelector(`#avatar`);\nconst previewAvatar = document.querySelector(`.ad-form-header__upload img`);\nconst fileChooserImage = document.querySelector(`#images`);\nconst previewPicture = document.querySelector(`.ad-form__photo`);\n\nconst reader = new FileReader();\n\nconst imageChange = (fileChooser, img) => {\n  const file = fileChooser.files[0];\n  const fileName = file.name.toLowerCase();\n  const matchingTheFileType = FILE_TYPES.some((e) => fileName.endsWith(e));\n  if (matchingTheFileType) {\n    reader.addEventListener(`load`, () => {\n      img.src = reader.result;\n    });\n    reader.readAsDataURL(file);\n  }\n};\n\nconst onFileChooserAvatarChange = () => {\n  imageChange(fileChooserAvatar, previewAvatar);\n};\n\nconst onFileChooserImageChange = () => {\n  const picture = document.createElement(`img`);\n  picture.style.width = `40px`;\n  picture.style.height = `40px`;\n  previewPicture.appendChild(picture);\n  imageChange(fileChooserImage, picture);\n};\n\nconst reset = () => {\n  previewAvatar.src = `img/muffin-grey.svg`;\n  const image = document.querySelector(`.ad-form__photo img`);\n  if (image) {\n    image.remove();\n  }\n};\n\nconst addListeners = () => {\n  fileChooserAvatar.addEventListener(`change`, onFileChooserAvatarChange);\n  fileChooserImage.addEventListener(`change`, onFileChooserImageChange);\n};\n\nwindow.preview = {\n  addListeners,\n  reset,\n};\n\n\n//# sourceURL=webpack://keksobooking/./js/modules/preview.js?")},638:()=>{eval("\n\nconst main = $(`main`);\nconst successModalTemplate = $(`#success`).contents();\nconst errorModalTemplate = $(`#error`).contents();\n\nconst renderSuccessModal = () => {\n  const modalSuccess = successModalTemplate.clone();\n  main.append(modalSuccess);\n  return modalSuccess;\n};\n\nconst onSuccessClose = (evt) => {\n  evt.preventDefault();\n  $(`.success`).remove();\n};\n\nconst renderErrorModal = () => {\n  const modalError = errorModalTemplate.clone();\n  main.append(modalError);\n  return modalError;\n};\n\nconst onErrorClose = (evt) => {\n  evt.preventDefault();\n  $(`.error`).remove();\n};\n\nconst onEscapeKeydown = (evt) => {\n  const success = main.find(`.success`);\n  const error = main.find(`.error`);\n  if (evt.key === `Escape` && success) {\n    onSuccessClose(evt);\n  } else if (evt.key === `Escape` && error) {\n    onErrorClose(evt);\n  }\n};\n\nconst onDocumentClick = (evt) => {\n  const success = $(`.success`);\n  const error = $(`.error`);\n  if (success) {\n    onSuccessClose(evt);\n  } else if (error) {\n    onErrorClose(evt);\n  }\n};\n\nconst onErrorButtonClick = (evt) => {\n  evt.preventDefault();\n  $(`.error`).remove();\n};\n\nconst addListenersOnSuccess = () => {\n  $(document).on(`click`, onDocumentClick);\n  $(document).on(`keydown`, onEscapeKeydown);\n};\n\nconst addListenersOnError = () => {\n  const errorButton = main.querySelector(`.error__button`);\n  errorButton.on(`click`, onErrorButtonClick);\n  $(document).on(`click`, onDocumentClick);\n  $(document).on(`keydown`, onEscapeKeydown);\n};\n\nconst showSuccessModal = () => {\n  renderSuccessModal();\n  addListenersOnSuccess();\n};\n\nconst showErrorModal = () => {\n  renderErrorModal();\n  addListenersOnError();\n};\n\nwindow.utilForm = {\n  showSuccessModal,\n  showErrorModal,\n};\n\n\n//# sourceURL=webpack://keksobooking/./js/modules/util-form.js?")},126:()=>{eval("\n\nconst ERROR_MODAL_DISPLAY_TIME = 3000;\n\nconst showErrorMessage = (errorMessage) => {\n  const errorModal = $(`<div></div>`);\n  errorModal.addClass(`modal-error`);\n  errorModal.text(errorMessage);\n  $(`body`).before(errorModal);\n  setTimeout(() => errorModal.remove(), ERROR_MODAL_DISPLAY_TIME);\n};\n\nwindow.util = {\n  showErrorMessage,\n};\n\n\n//# sourceURL=webpack://keksobooking/./js/modules/util.js?")}};__webpack_modules__[752](),__webpack_modules__[638](),__webpack_modules__[126](),__webpack_modules__[286](),__webpack_modules__[600](),__webpack_modules__[695](),__webpack_modules__[788](),__webpack_modules__[717](),__webpack_modules__[391](),__webpack_modules__[316]();var __webpack_exports__={};__webpack_modules__[444]()})();