export default async function handler(req, res) {
  const lcdUrl = "https://lcd-osmosis.keplr.app";
  const wallet = "osmo1psaaa8z5twqgs4ahgqdxwl86eydmlwhesmv4s9";

  try {
    const [balanceResp, txResp] = await Promise.all([
      fetch(`${lcdUrl}/cosmos/bank/v1beta1/balances/${wallet}`),
      fetch(`${lcdUrl}/cosmos/tx/v1beta1/txs?events=transfer.recipient='${wallet}'&order_by=ORDER_BY_DESC&limit=50`)
    ]);

    if (!balanceResp.ok || !txResp.ok) {
      throw new Error("Ошибка при запросе данных с LCD");
    }

    const balances = await balanceResp.json();
    const txData = await txResp.json();

    // Оставим только те сообщения, где адрес назначения — наш кошелёк
    const incomingTxs = txData.tx_responses.filter(tx =>
      tx.tx.body.messages.some(
        msg =>
          msg["@type"] === "/cosmos.bank.v1beta1.MsgSend" &&
          msg.to_address === wallet
      )
    );

    res.status(200).json({ balances, incoming_transactions: incomingTxs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


