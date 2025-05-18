export const TransactionTokenGenerator = () => {
  return "DEBCHC" + Math.floor(100000 + Math.random() * 900000)
}