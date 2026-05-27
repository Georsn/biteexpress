import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // Hambúrgueres
  {
    id: 'b1',
    name: 'Mega Cheddar Bacon',
    description: 'Pão de brioche selado na manteiga, blend ultra de 150g, muito cheddar cremoso derretido e fatias generosas de bacon super crocante.',
    price: 36.90,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Pão Brioche', 'Blend Bovino 150g', 'Queijo Cheddar', 'Fatias de Bacon', 'Molho Especial'],
    isPopular: true,
    preparationTime: 15
  },
  {
    id: 'b2',
    name: 'Smash Salada Duplo',
    description: 'Dois blends smash artesanais de 80g de pura carne bovina grelhada na chapa, queijo prato derretido, alface fresca, tomate fatiado, cebola roxa e maionese secreta da casa.',
    price: 29.90,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Pão com Gergelim', '2x Blend Smash 80g', 'Queijo Prato', 'Alface Americana', 'Tomate', 'Cebola Roxa', 'Maionese Secreta'],
    isPopular: true,
    preparationTime: 12
  },
  {
    id: 'b3',
    name: 'Crispy Chicken Burger',
    description: 'Filé de peito de frango empanado em panko ultra crocante, muito queijo muçarela, alface romana, picles fatiados e molho rústico de mostarda e mel.',
    price: 31.90,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Pão Brioche', 'Frango Crocante 160g', 'Queijo Muçarela', 'Alface Romana', 'Picles', 'Molho Mostarda e Mel'],
    isPopular: false,
    preparationTime: 18
  },
  {
    id: 'b4',
    name: 'Veggie Mushroom Burger',
    description: 'Hambúrguer vegetariano premium feito de grão-de-bico com especiarias, combinado com cogumelos salteados no azeite de ervas, rúcula fresca e maionese de alho.',
    price: 34.90,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Pão Australiano', 'Hambúrguer de Grão-de-Bico', 'Shimeji e Paris', 'Rúcula Fresca', 'Maionese de Alho'],
    isPopular: false,
    preparationTime: 15
  },

  // Acompanhamentos
  {
    id: 's1',
    name: 'Batata Rústica da Casa',
    description: 'Batatas rústicas com corte especial, temperadas com sal marinho, alecrim fresco e páprica defumada. Acompanha molho de alho cremoso.',
    price: 18.90,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Batatas Especiais', 'Sal Marinho', 'Alecrim Rústico', 'Páprica', 'Maionese de Alho'],
    isPopular: true,
    preparationTime: 10
  },
  {
    id: 's2',
    name: 'Onion Rings Crocantes',
    description: 'Anéis de cebola gigantes empanados em farinha panko temperada e fritos até dourar. Acompanha molho barbecue artesanal.',
    price: 16.90,
    category: 'sides',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsOLJs2HpMyEfM69gTF32WJPzEPz1kkMGyyQ&s',
    ingredients: ['Cebolas Gigantes', 'Farinha Panko', 'Tempero de Ervas', 'Molho Barbecue'],
    isPopular: false,
    preparationTime: 8
  },
  {
    id: 's3',
    name: 'Nugget Chicken Bites',
    description: '10 unidades de pedaços suculentos de peito de frango selecionados, empanados de forma super crocante. Acompanha molho honey mustard.',
    price: 19.90,
    category: 'sides',
    image: 'https://www.acozykitchen.com/wp-content/uploads/2025/12/HomemadeChickenNuggets-06.jpg',
    ingredients: ['Filé de Frango Grelhado', 'Empanamento Crocante', 'Molho Honey Mustard'],
    isPopular: false,
    preparationTime: 10
  },

  // Bebidas
  {
    id: 'd1',
    name: 'Coca-Cola Lata Trincando',
    description: 'Lata de Coca-Cola original de 350ml bem gelada, servida com copo de gelo e limão.',
    price: 6.50,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Coca-Cola 350ml', 'Gelo', 'Limão Fresh'],
    isPopular: true,
    preparationTime: 3
  },
  {
    id: 'd2',
    name: 'Suco de Laranja Integral',
    description: 'Suco 100% natural espremido na hora, livre de adição de açúcar, conservantes ou água. Fonte de vitamina C fresca.',
    price: 9.90,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Laranjas Puras 400ml'],
    isPopular: false,
    preparationTime: 5
  },
  {
    id: 'd3',
    name: 'Soda Italiana de Maçã Verde',
    description: 'Água gaseificada premium combinada com xarope artesanal gourmet de maçã verde e muito gelo refrescante.',
    price: 11.90,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Água Gaseificada', 'Xarope Maçã Verde', 'Hortelã Fresca', 'Gelo'],
    isPopular: false,
    preparationTime: 4
  },

  // Sobremesas
  {
    id: 'e1',
    name: 'Milkshake de Ovomaltine',
    description: 'Sorvete cremoso de creme batido com leite integral, muito Ovomaltine crocante e cobertura premium de chocolate belga.',
    price: 18.90,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Sorvete de Creme Premium', 'Leite Integral', 'Ovomaltine Crocante', 'Chantilly', 'Calda de Chocolate'],
    isPopular: true,
    preparationTime: 6
  },
  {
    id: 'e2',
    name: 'Petit Gâteau Chocolate',
    description: 'Bolo suculento com casca macia e meio recheado de chocolate derretido quente, acompanhado de uma generosa bola de sorvete de baunilha.',
    price: 21.90,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Petit Gâteau de Chocolate 120g', 'Fudge de Chocolate Quente', 'Sorvete de Baunilha'],
    isPopular: false,
    preparationTime: 10
  },
  {
    id: 'e3',
    name: 'Churros com Doce de Leite',
    description: 'Porção com 4 unidades de mini churros recheados de puro doce de leite cremoso artesanal e polvilhados de açúcar e canela.',
    price: 14.90,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1559981421-3e0c0d712e3b?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Massas de Churros', 'Açúcar de Confeiteiro', 'Canela Perfumada', 'Doce de Leite Viçosa'],
    isPopular: false,
    preparationTime: 8
  }
];

export const PROMOTIONS = [
  {
    id: 'p1',
    title: 'Combo Smash Perfeito',
    subtitle: 'Smash Duplo + Batata Rústica + Cola',
    badge: '18% OFF',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600',
    originalPrice: 55.30,
    promoPrice: 44.90,
    items: ['b2', 's1', 'd1']
  },
  {
    id: 'p2',
    title: 'Festival da Batata',
    subtitle: 'Adicione Batata Rústica por apenas R$ 12',
    badge: 'FRETE GRÁTIS',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
    originalPrice: 18.90,
    promoPrice: 12.00,
    items: ['s1']
  }
];
