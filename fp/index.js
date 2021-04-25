const log = console.log;

const curry = (f) => (a, ..._) =>
  _.length ? f(a, ..._) : (..._) => f(a, ..._);

const map = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
});

const filter = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    if (f(a)) res.push(a);
  }
  return res;
});

const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});

const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000 },
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 },
];

const add = (a, b) => a + b;

const go = (...args) => reduce((a, f) => f(a), args);
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

const sum = curry((f, iter) => go(iter, map(f), reduce(add)));

const total_quantity = sum((p) => p.quantity);

const total_price = sum((p) => p.price * p.quantity);

document.querySelector('#app').innerHTML = `
    <table>
      <tr>
        <th></th>
        <th>상품 이름</th>
        <th>가격</th>
        <th>수량</th>
        <th>총 가격</th>
      </tr>
      ${go(
        products,
        sum(
          (p) => `
          <tr>
            <td><input type="checkbox" ${p.is_selected ? 'checked' : ''}></td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td><input type="number" value="${p.quantity}"></td>
            <td>${p.price * p.quantity}</td>
          </tr>
      `,
        ),
      )}
      <tr>
        <td colspan="3">합계</td>
        <td>${total_quantity(filter((p) => p.is_selected, products))}</td>
        <td>${total_price(filter((p) => p.is_selected, products))}</td>
      </tr>
    </table>
  `;
