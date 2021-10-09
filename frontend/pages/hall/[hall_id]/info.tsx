import { useRouter } from "next/router";


const HallInfo = () => {
    const router = useRouter();
    const { hall_id } = router.query;
    return (
        <div>
            Hall Info {hall_id}
        </div>

    )
}

export default HallInfo;