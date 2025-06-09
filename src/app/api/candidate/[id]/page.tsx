// Add this inside the component (after fetching profile)
const [allocation, setAllocation] = useState<any>(null);

useEffect(() => {
  fetch(`/api/candidate/${params.id}/result`)
    .then(res => res.json())
    .then(data => {
      if (data.success) setAllocation(data.allocation);
    });
}, [params.id]);

// Add this to the return section
{allocation && (
  <div className="mt-4 p-4 bg-green-50 rounded">
    <h3 className="font-semibold">Allocated Course</h3>
    <p>{allocation.course_name}</p>
    <p>Allocation Date: {new Date(allocation.allocated_at).toLocaleDateString()}</p>
  </div>
)}
