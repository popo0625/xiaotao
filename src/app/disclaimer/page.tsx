import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">免责声明</h1>

      <div className="mt-8 space-y-6 text-sm text-gray-600 leading-relaxed">
        <p>
          校淘（以下简称"本平台"）是一个桂林电子科技大学校园二手交易信息撮合平台，旨在为用户提供闲置物品交易信息发布与交流服务。使用本平台即表示您已阅读并同意本免责声明。
        </p>

        <section>
          <h2 className="text-base font-semibold text-gray-900">1. 平台性质</h2>
          <p className="mt-2">
            本平台仅作为信息展示和交易撮合的中介平台，不参与用户之间的实际交易过程，不对交易双方的履约行为承担任何保证责任。平台不收取交易佣金，不提供支付担保服务。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900">2. 交易风险</h2>
          <p className="mt-2">
            用户在本平台发布的商品信息、交易内容等均由用户自行提供并对其真实性、合法性、准确性负全部责任。本平台不保证商品信息的真实性、完整性和有效性。用户之间因交易产生的任何纠纷（包括但不限于商品质量、价格、交付、付款等争议），应由交易双方自行协商解决。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900">3. 诈骗防范</h2>
          <p className="mt-2">
            本平台郑重提醒用户：警惕各类网络诈骗行为。如遇以下情况请立即终止交易并向公安机关报案：
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>对方要求提前付款、缴纳定金或保证金</li>
            <li>对方发送不明链接或二维码要求扫码付款</li>
            <li>交易价格明显低于市场正常水平</li>
            <li>对方以各种理由拒绝当面交易</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900">4. 责任限制</h2>
          <p className="mt-2">
            在法律法规允许的最大范围内，本平台不对因使用或无法使用本平台服务而产生的任何直接、间接、附带、特殊或后果性损害承担责任，包括但不限于因交易纠纷、信息不实、诈骗行为等造成的损失。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900">5. 用户责任</h2>
          <p className="mt-2">
            用户在使用本平台时应遵守国家法律法规，不得发布虚假信息、违法信息或进行任何违法违规交易。用户应对自己的行为承担全部法律责任。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900">6. 建议与共识</h2>
          <p className="mt-2">
            本平台建议用户尽量选择在校内公共场所当面交易，核实对方学生身份，仔细检查商品状况。交易过程中保留聊天记录、转账凭证等证据，以便在发生纠纷时维护自身权益。
          </p>
        </section>

        <div className="border-t border-gray-200 pt-6 text-xs text-gray-400">
          <p>更新日期：2026年5月</p>
          <p className="mt-1">如对本免责声明有任何疑问，请联系平台管理员。</p>
        </div>

        <div className="pt-4">
          <Link href="/products" className="text-sm text-blue-600 hover:underline">
            ← 返回商品列表
          </Link>
        </div>
      </div>
    </div>
  );
}
