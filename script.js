let cart = []; 
let winQtd = 1;  
modalKey = 0;  
const q = (el) => document.querySelector(el); 
const qsa = (el) => document.querySelectorAll(el); 

//map the JSON list - Pizzas
pizzaJson.map((item , index) => {
    let pizzaItem = q('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `$ ${item.price.toFixed(2).replace(".",",")}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    pizzaItem.querySelector('a').addEventListener ('click', (ev)=>{
        ev.preventDefault();

        let key = ev.target.closest ('.pizza-item').getAttribute ('data-key'); 
        winQtd = 1;
        modalKey = key; 

        //fill the items in the modal - q (select) and qsa (select all)
        q('.pizzaBig img').src = pizzaJson[key].img;
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        q('.pizzaInfo--actualPrice').innerHTML = `$ ${pizzaJson[key].price.toFixed(2).replace(".",",")}`;
        q('.pizzaInfo--size.selected').classList.remove('selected');
       
        qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected'); 
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];           
        });
        q('.pizzaInfo--qt').innerHTML = winQtd; 
        
        //estilos aos itens
        q('.pizzaWindowArea').style.opacity = 0;
        q('.pizzaWindowArea').style.display = 'flex'; 
        setTimeout (()=>{
        q('.pizzaWindowArea').style.opacity = 1;
        }, 200); //200 milliseconds, 1/5 of 1 second (1000 milliseconds = 1 second)

    });
   q('.pizza-area').append (pizzaItem); 
})

//modal events
function closeWin() {
    q('.pizzaWindowArea').style.opacity = 0;
    setTimeout (()=>{
        q('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

//cancel and return
qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach ((itemCancel) => {
    itemCancel.addEventListener('click', closeWin);
});

//increment and decrement the order quantity
q('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (winQtd > 1) {
    winQtd--;
    q('.pizzaInfo--qt').innerHTML = winQtd;   
    };    
})

q('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    winQtd++;
    q('.pizzaInfo--qt').innerHTML = winQtd;
})
    
//select specific size
qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (elem)=>{
        q('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })          
});

//cart
q('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identif = pizzaJson[modalKey].id+'@'+size; 
    let key = cart.findIndex((item) => item.identif == identif);

    if (key > -1) {
        cart[key].qt += winQtd;
    } else {
        cart.push({
            identif,
            id:pizzaJson[modalKey].id,
            size,
            qt:winQtd
        });
    }

    updateCart();
    closeWin();    
});

//open and close menu-mobile
q('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        q('aside').style.left = '0';
    }
});
q('.menu-closer').addEventListener('click', () => {
    if(cart.length > 0) {
        q('aside').style.left = '100vw';
    }
});

function updateCart() {
    q('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        q('aside').classList.add('show');
        q('.cart').innerHTML = ''; 

        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = q('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'SM';
                    break;
                case 1:
                    pizzaSizeName = 'MD';
                    break;    
                case 2:
                    pizzaSizeName = 'BG';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
        
            q('.cart').append(cartItem); //adiciona
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        
        q('.subtotal span:last-child').innerHTML = `$ ${subtotal.toFixed(2).replace(".",",")}`;
        q('.desconto span:last-child').innerHTML = `$ ${desconto.toFixed(2).replace(".",",")}`;
        q('.total span:last-child').innerHTML = `$ ${total.toFixed(2).replace(".",",")}`;

        
    } else { 
        q('aside').classList.remove('show');
        q('aside').style.left = '100vw';
    }
} 
