import { prisma } from "@/lib/prisma";
import { currentUserId, role } from "@/lib/utils";

const Announcements = async () => {

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
  });
  console.log(data);
  return (
    <div className="bg-white p-4 rounded-md">
  <div className="flex items-center justify-between">
    <h1 className="text-xl font-semibold">Announcements</h1>
    <span className="text-xs text-gray-400">View All</span>
  </div>

  <div className="flex flex-col gap-4 mt-4">
    {data && data.length > 0 ? (
      data.slice(0, 3).map((announcement, index) => (
        <div
          key={announcement.id || index}
          className={`rounded-md p-4 ${
            index === 0
              ? 'bg-lamaSkyLight'
              : index === 1
              ? 'bg-lamaPurpleLight'
              : 'bg-lamaYellowLight'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{announcement.title}</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              {new Date(announcement.date).toLocaleDateString('en-IN')}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{announcement.description}</p>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-400 italic">No announcements available.</p>
    )}
  </div>
</div>
  );
}

export default Announcements;
