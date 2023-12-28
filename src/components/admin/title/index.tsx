export default function Component({ title, subtitle }: { title: string, subtitle: string }) {
	return (
		<section className="py-5 border-b bg-gray-50">
			<div className="container">
				<div className="text-xl md:text-3xl font-bold capitalize">{title}</div>
				<div className="text-sm md:text-base text-gray-600 font-medium sentence">{subtitle}</div>
			</div>
		</section>
	);
}