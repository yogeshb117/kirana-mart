
import { getCoupons } from '@/app/actions/coupons';
import { CouponManager } from '@/components/admin/CouponManager';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
    const coupons = await getCoupons();

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Coupons & Discounts</h1>
                    <p className="text-gray-500">Manage promotional codes for your store.</p>
                </div>
            </div>

            <CouponManager initialCoupons={coupons} />
        </div>
    );
}
